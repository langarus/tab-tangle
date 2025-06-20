// Background service worker for Chrome extension
console.log("Tab Dashboard Extension background script loaded");

interface TabInfo {
  id?: number;
  title?: string;
  url?: string;
  favIconUrl?: string;
  active: boolean;
  windowId: number;
}

// Store active connections to dashboard
let dashboardConnections: chrome.runtime.Port[] = [];

// Debounce mechanism for tab updates
let updateTimeout: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY = 100; // milliseconds

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  // Send initial tab data
  sendTabsToConnectedDashboards();
});

// Listen for connections from content scripts (dashboard bridge)
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "dashboard-bridge") {
    console.log("Dashboard bridge connected");
    dashboardConnections.push(port);

    // Send current tabs immediately to new connection
    getAllTabs().then((tabs) => {
      port.postMessage({
        type: "TABS_UPDATE",
        tabs,
        timestamp: Date.now(),
      });
    });

    // Handle port disconnect
    port.onDisconnect.addListener(() => {
      console.log("Dashboard bridge disconnected");
      dashboardConnections = dashboardConnections.filter(
        (conn) => conn !== port
      );
    });

    // Handle messages from dashboard bridge
    port.onMessage.addListener((message) => {
      if (message.type === "REQUEST_TABS") {
        getAllTabs().then((tabs) => {
          port.postMessage({
            type: "TABS_UPDATE",
            tabs,
            timestamp: Date.now(),
          });
        });
      } else if (message.type === "CLOSE_TAB") {
        handleCloseTab(message.tabId);
      } else if (message.type === "CLOSE_TABS") {
        handleCloseTabs(message.tabIds);
      } else if (message.type === "SWITCH_TO_TAB") {
        handleSwitchToTab(message.tabId);
      } else if (message.type === "RESTORE_TABS") {
        handleRestoreTabs(message.tabs);
      }
    });
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_TABS") {
    getAllTabs().then((tabs) => {
      sendResponse({ tabs });
    });
    return true; // Keep message channel open for async response
  }

  if (message.type === "SEND_TABS_TO_DASHBOARD") {
    sendTabsToConnectedDashboards();
    sendResponse({ success: true });
    return true;
  }

  if (message.type === "GET_CONNECTION_STATUS") {
    sendResponse({ connected: dashboardConnections.length > 0 });
    return true;
  }
});

// Listen for tab events for live updates
chrome.tabs.onCreated.addListener((tab) => {
  console.log("Tab created - sending update", tab.id);
  // Use debounced update for tab creation
  debouncedSendTabs();
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log("Tab removed - sending update", tabId);
  // Immediate update for tab removal since it's critical
  sendTabsToConnectedDashboards();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only send updates for significant changes
  if (changeInfo.status === "complete" || changeInfo.title || changeInfo.url) {
    console.log("Tab updated - sending update", tabId, changeInfo);
    debouncedSendTabs();
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log("Tab activated - sending update", activeInfo.tabId);
  // Immediate update for tab activation to show active state quickly
  sendTabsToConnectedDashboards();
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    console.log("Window focus changed - sending update", windowId);
    debouncedSendTabs();
  }
});

async function getAllTabs(): Promise<TabInfo[]> {
  try {
    const tabs = await chrome.tabs.query({});
    return tabs.map((tab) => ({
      id: tab.id,
      title: tab.title,
      url: tab.url,
      favIconUrl: tab.favIconUrl,
      active: tab.active,
      windowId: tab.windowId,
    }));
  } catch (error) {
    console.error("Error getting tabs:", error);
    return [];
  }
}

async function sendTabsToConnectedDashboards() {
  if (dashboardConnections.length === 0) {
    return; // No connected dashboards
  }

  try {
    const tabs = await getAllTabs();
    const message = {
      type: "TABS_UPDATE",
      tabs,
      timestamp: Date.now(),
    };

    // Send to all connected dashboards
    dashboardConnections.forEach((port) => {
      try {
        port.postMessage(message);
      } catch (error) {
        console.error("Error sending message to dashboard:", error);
        // Remove invalid connections
        dashboardConnections = dashboardConnections.filter(
          (conn) => conn !== port
        );
      }
    });
  } catch (error) {
    console.error("Error sending tabs to dashboards:", error);
  }
}

// Debounced version of sendTabsToConnectedDashboards
function debouncedSendTabs() {
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
  updateTimeout = setTimeout(() => {
    sendTabsToConnectedDashboards();
    updateTimeout = null;
  }, DEBOUNCE_DELAY);
}

// Tab management functions
async function handleCloseTab(tabId: number) {
  try {
    await chrome.tabs.remove(tabId);
    console.log(`Closed tab ${tabId}`);
    // Send updated tabs immediately after closing
    setTimeout(() => {
      sendTabsToConnectedDashboards();
    }, 100); // Small delay to ensure Chrome has processed the change
  } catch (error) {
    console.error(`Error closing tab ${tabId}:`, error);
  }
}

async function handleCloseTabs(tabIds: number[]) {
  try {
    await chrome.tabs.remove(tabIds);
    console.log(`Closed ${tabIds.length} tabs`);
    // Send updated tabs immediately after closing
    setTimeout(() => {
      sendTabsToConnectedDashboards();
    }, 100); // Small delay to ensure Chrome has processed the change
  } catch (error) {
    console.error(`Error closing tabs:`, error);
  }
}

async function handleSwitchToTab(tabId: number) {
  try {
    // Get the tab to find its window
    const tab = await chrome.tabs.get(tabId);
    // Switch to the tab
    await chrome.tabs.update(tabId, { active: true });
    // Focus the window containing the tab
    await chrome.windows.update(tab.windowId, { focused: true });
    console.log(`Switched to tab ${tabId}`);
    // Send updated tabs to reflect the active state change
    setTimeout(() => {
      sendTabsToConnectedDashboards();
    }, 100);
  } catch (error) {
    console.error(`Error switching to tab ${tabId}:`, error);
  }
}

async function handleRestoreTabs(
  tabsToRestore: Array<{ url?: string; windowId: number; title?: string }>
) {
  try {
    for (const tabData of tabsToRestore) {
      if (tabData.url) {
        await chrome.tabs.create({
          url: tabData.url,
          windowId: tabData.windowId,
          active: false,
        });
      }
    }
    console.log(`Restored ${tabsToRestore.length} tabs`);
    // Send updated tabs immediately after restoring
    setTimeout(() => {
      sendTabsToConnectedDashboards();
    }, 100); // Small delay to ensure Chrome has processed the change
  } catch (error) {
    console.error(`Error restoring tabs:`, error);
  }
}
