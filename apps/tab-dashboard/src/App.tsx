import React, { useState, useEffect, useRef } from "react";
import { TabInfo, ViewMode, NotificationState } from "./types";
import { ModeSelector } from "./components/ModeSelector";
import TabList from "./components/TabList";
import { WindowsView } from "./components/WindowsView";
import { DomainsView } from "./components/DomainsView";
import { Notification } from "./components/Notification";

// Get extension ID from URL parameters or detect it
const getExtensionId = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get("extensionId");
};

function App() {
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentMode, setCurrentMode] = useState<ViewMode>("all");
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const notificationTimeout = useRef<NodeJS.Timeout | null>(null);

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
        console.log("Received tabs update from extension:", data);
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
  const handleClose = (tabId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      // Optimistically remove the tab from local state for immediate UI feedback
      setTabs((prevTabs) => prevTabs.filter((t) => t.id !== tabId));

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

  const renderCurrentView = () => {
    if (currentMode === "windows") {
      return (
        <WindowsView
          tabs={tabs}
          onClose={handleClose}
          onCloseGroup={handleCloseGroup}
        />
      );
    }

    if (currentMode === "domains") {
      return (
        <DomainsView
          tabs={tabs}
          onClose={handleClose}
          onCloseGroup={handleCloseGroup}
        />
      );
    }

    return <TabList tabs={tabs} onClose={handleClose} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Tab Dashboard
                </h1>
                <p className="text-sm text-gray-500">{tabs.length} open tabs</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isConnected
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </div>
              {lastUpdate && (
                <span className="text-sm text-gray-500">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Mode Selector */}
        {isConnected && tabs.length > 0 && (
          <div className="mb-8">
            <ModeSelector
              currentMode={currentMode}
              onModeChange={setCurrentMode}
            />
          </div>
        )}

        {/* Content Area */}
        <div className="relative">
          {isConnected ? (
            renderCurrentView()
          ) : (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Getting Started
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Install the Tab Dashboard Chrome extension</li>
                <li>Make sure this page is open at http://localhost:3002</li>
                <li>
                  The extension will automatically connect and start sending tab
                  data
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>

      <Notification notification={notification} onUndo={handleUndo} />
    </div>
  );
}

export default App;
