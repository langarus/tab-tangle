import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { NotificationState, TabInfo } from "../types";

const useGeneral = () => {
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const notificationTimeout = useRef<NodeJS.Timeout | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // Check if Chrome runtime is available (we're in a Chrome context)
    if (typeof chrome !== "undefined" && chrome.runtime) {
      console.log("Chrome runtime detected, setting up connection listener");
      setupExtensionCommunication();
    } else {
      console.log("Chrome runtime not available - extension features disabled");
      setIsConnected(false);
    }
  }, []);

  const setupExtensionCommunication = () => {
    // Create a custom event system for communication
    const handleExtensionMessage = (event: CustomEvent) => {
      const { type, data } = event.detail;

      if (type === "TABS_UPDATE") {
        setTabs(data.tabs);
        setLastUpdate(new Date(data.timestamp));
        setIsConnected(true);
      }
    };

    // Listen for custom events from the extension
    window.addEventListener(
      "extensionMessage",
      handleExtensionMessage as EventListener
    );

    // Request initial tabs data
    const requestTabs = () => {
      window.dispatchEvent(
        new CustomEvent("dashboardMessage", {
          detail: { type: "REQUEST_TABS" },
        })
      );
    };

    // Request tabs on load and periodically check connection
    requestTabs();
    const interval = setInterval(() => {
      if (!isConnected) {
        requestTabs();
      }
    }, 5000);

    return () => {
      window.removeEventListener(
        "extensionMessage",
        handleExtensionMessage as EventListener
      );
      clearInterval(interval);
    };
  };

  // Helper to show notification
  const showNotification = (tabsClosed: TabInfo[]) => {
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }
    setNotification({ tabs: tabsClosed, visible: true });
    notificationTimeout.current = setTimeout(() => {
      setNotification((prev) => prev && { ...prev, visible: false });
    }, 5000);
  };

  // Handle closing individual tabs
  const handleClose = (
    tabId: number,
    e: React.MouseEvent,
    selectedTabs?: TabInfo[],
    isSelectMode?: boolean,
    resetSelection?: () => void
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // If in select mode, close all selected tabs and reset selection
    if (
      isSelectMode &&
      selectedTabs &&
      selectedTabs.length > 0 &&
      resetSelection
    ) {
      const tabIds = selectedTabs
        .map((tab) => tab.id)
        .filter(Boolean) as number[];
      if (tabIds.length > 0) {
        // Optimistically remove the tabs from local state for immediate UI feedback
        setTabs((prevTabs) => prevTabs.filter((t) => !tabIds.includes(t.id!)));

        // Send close group request to extension
        window.dispatchEvent(
          new CustomEvent("dashboardMessage", {
            detail: { type: "CLOSE_TABS", tabIds },
          })
        );
        showNotification(selectedTabs);

        // Reset selection
        resetSelection();
      }
      return;
    }

    // Normal mode - close individual tab
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      // Send close request to extension
      window.dispatchEvent(
        new CustomEvent("dashboardMessage", {
          detail: { type: "CLOSE_TAB", tabId },
        })
      );
      showNotification([tab]);
    }
  };

  // Handle closing groups of tabs
  const handleCloseGroup = (tabsToClose: TabInfo[], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const tabIds = tabsToClose.map((tab) => tab.id).filter(Boolean) as number[];
    if (tabIds.length > 0) {
      // Optimistically remove the tabs from local state for immediate UI feedback
      setTabs((prevTabs) => prevTabs.filter((t) => !tabIds.includes(t.id!)));

      // Send close group request to extension
      window.dispatchEvent(
        new CustomEvent("dashboardMessage", {
          detail: { type: "CLOSE_TABS", tabIds },
        })
      );
      showNotification(tabsToClose);
    }
  };

  // Undo handler
  const handleUndo = () => {
    if (!notification?.tabs) return;

    // Send restore request to extension
    const tabsToRestore = notification.tabs.map((tab) => ({
      url: tab.url,
      windowId: tab.windowId,
      title: tab.title,
    }));

    window.dispatchEvent(
      new CustomEvent("dashboardMessage", {
        detail: { type: "RESTORE_TABS", tabs: tabsToRestore },
      })
    );

    setNotification(null);
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }
  };

  return {
    tabs,
    isConnected,
    notification,
    lastUpdate,
    handleClose,
    handleCloseGroup,
    handleUndo,
  };
};

const useSelectTabs = () => {
  const [selectedTabs, setSelectedTabs] = useState<TabInfo[]>([]);

  const handleSelectTabs = (tabs: TabInfo[]) => {
    setSelectedTabs((prev) => [...prev, ...tabs]);
  };

  const handleDeselectTabs = (tabs: TabInfo[]) => {
    setSelectedTabs((prev) =>
      [...prev].filter((t) => !tabs.map((t) => t.id).includes(t.id))
    );
  };

  const resetSelection = () => {
    setSelectedTabs([]);
  };

  const isSelectMode = selectedTabs.length > 0;

  return {
    selectedTabs,
    handleSelectTabs,
    handleDeselectTabs,
    resetSelection,
    isSelectMode,
  };
};

type GeneralContextType = ReturnType<typeof useGeneral> &
  ReturnType<typeof useSelectTabs>;

const GeneralContext = createContext({} as GeneralContextType);

const GeneralProvider = ({ children }: PropsWithChildren) => {
  const generalState = useGeneral();
  const selectTabsState = useSelectTabs();

  return (
    <GeneralContext.Provider value={{ ...generalState, ...selectTabsState }}>
      {children}
    </GeneralContext.Provider>
  );
};

const useGeneralCtx = () => useContext(GeneralContext);

export { GeneralProvider, useGeneralCtx };
