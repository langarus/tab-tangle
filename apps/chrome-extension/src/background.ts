// Background service worker for Chrome extension
import type { Runtime, Tabs, Windows } from "webextension-polyfill";

// Load polyfill for service worker (Chrome)
if (typeof importScripts === "function") {
  importScripts("browser-polyfill.js");
}

// Browser API - provided by webextension-polyfill or loaded via scripts array
const browser = (globalThis as any).browser || (globalThis as any).chrome;

interface TabInfo {
  id?: number;
  title?: string;
  url?: string;
  favIconUrl?: string;
  active: boolean;
  windowId: number;
  lastAccessed?: number;
}

// Store active connections to dashboard
let dashboardConnections: Runtime.Port[] = [];

// Debounce mechanism for tab updates
let updateTimeout: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY = 100; // milliseconds

// Listen for extension installation
browser.runtime.onInstalled.addListener(() => {
  // Send initial tab data
  sendTabsToConnectedDashboards();
});

// Click on extension icon → open or focus the dashboard
const DASHBOARD_URLS = [
  "https://www.tab-tangle.com/app",
  "http://localhost:3002",
];

browser.action.onClicked.addListener(async () => {
  try {
    const tabs = await browser.tabs.query({});
    // Find an existing dashboard tab
    const dashboardTab = tabs.find((tab: Tabs.Tab) =>
      DASHBOARD_URLS.some((url) => tab.url?.startsWith(url))
    );

    if (dashboardTab?.id) {
      // Focus existing dashboard tab
      await browser.tabs.update(dashboardTab.id, { active: true });
      await browser.windows.update(dashboardTab.windowId, { focused: true });
    } else {
      // Open new dashboard tab
      await browser.tabs.create({ url: "https://www.tab-tangle.com/app" });
    }
  } catch (error) {
    console.error("Error opening dashboard:", error);
    // Fallback: just open a new tab
    browser.tabs.create({ url: "https://www.tab-tangle.com/app" });
  }
});

// Listen for connections from content scripts (dashboard bridge)
browser.runtime.onConnect.addListener((port: Runtime.Port) => {
  if (port.name === "dashboard-bridge") {
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
      dashboardConnections = dashboardConnections.filter(
        (conn) => conn !== port
      );
    });

    // Handle messages from dashboard bridge
    port.onMessage.addListener((message: any) => {
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
browser.runtime.onMessage.addListener((message: any, sender: Runtime.MessageSender, sendResponse: (response?: any) => void) => {
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

  if (message.type === "CLOSE_TAB") {
    console.log("Popup requested to close tab:", message.tabId);
    handleCloseTab(message.tabId)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Error closing tab:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (message.type === "CLOSE_TABS") {
    console.log("Popup requested to close tabs:", message.tabIds);
    handleCloseTabs(message.tabIds)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Error closing tabs:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (message.type === "SWITCH_TO_TAB") {
    console.log("Popup requested to switch to tab:", message.tabId);
    handleSwitchToTab(message.tabId)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Error switching to tab:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

// Listen for tab events for live updates
browser.tabs.onCreated.addListener((tab: Tabs.Tab) => {
  // Use debounced update for tab creation
  debouncedSendTabs();
});

browser.tabs.onRemoved.addListener((tabId: number, removeInfo: Tabs.OnRemovedRemoveInfoType) => {
  // Immediate update for tab removal since it's critical
  sendTabsToConnectedDashboards();
});

browser.tabs.onUpdated.addListener((tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) => {
  // Only send updates for significant changes
  if (changeInfo.status === "complete" || changeInfo.title || changeInfo.url) {
    debouncedSendTabs();
  }
});

browser.tabs.onActivated.addListener((activeInfo: Tabs.OnActivatedActiveInfoType) => {
  // Immediate update for tab activation to show active state quickly
  sendTabsToConnectedDashboards();
});

browser.windows.onFocusChanged.addListener((windowId: number) => {
  if (windowId !== browser.windows.WINDOW_ID_NONE) {
    debouncedSendTabs();
  }
});

// Privacy-sensitive URL patterns to optionally filter
const SENSITIVE_PATTERNS = [
  /^chrome:\/\//,
  /^chrome-extension:\/\//,
  /^about:/,
  /^file:\/\//,
  // Users can opt to hide these patterns in settings
];

async function getAllTabs(): Promise<TabInfo[]> {
  try {
    const tabs = await browser.tabs.query({});
    return tabs.map((tab: Tabs.Tab) => ({
      id: tab.id,
      title: tab.title,
      url: tab.url,
      favIconUrl: tab.favIconUrl,
      active: tab.active,
      windowId: tab.windowId,
      lastAccessed: tab.lastAccessed,
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
    await browser.tabs.remove(tabId);
    // Send updated tabs immediately after closing
    setTimeout(() => {
      sendTabsToConnectedDashboards();
    }, 100); // Small delay to ensure browser has processed the change
  } catch (error) {
    console.error(`Error closing tab ${tabId}:`, error);
  }
}

async function handleCloseTabs(tabIds: number[]) {
  try {
    await browser.tabs.remove(tabIds);
    // Send updated tabs immediately after closing
    setTimeout(() => {
      sendTabsToConnectedDashboards();
    }, 100); // Small delay to ensure browser has processed the change
  } catch (error) {
    console.error(`Error closing tabs:`, error);
  }
}

async function handleSwitchToTab(tabId: number) {
  try {
    // Get the tab to find its window
    const tab = await browser.tabs.get(tabId);
    // Switch to the tab
    await browser.tabs.update(tabId, { active: true });
    // Focus the window containing the tab
    await browser.windows.update(tab.windowId, { focused: true });
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
        await browser.tabs.create({
          url: tabData.url,
          windowId: tabData.windowId,
          active: false,
        });
      }
    }
    // Send updated tabs immediately after restoring
    setTimeout(() => {
      sendTabsToConnectedDashboards();
    }, 100); // Small delay to ensure browser has processed the change
  } catch (error) {
    console.error(`Error restoring tabs:`, error);
  }
}
