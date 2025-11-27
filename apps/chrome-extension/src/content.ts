// Content script for Chrome extension
import type { Runtime } from "webextension-polyfill";

// Browser API - provided by browser-polyfill.js loaded in manifest
const browser = (globalThis as any).browser || (globalThis as any).chrome;

// Only run on dashboard pages
if (
  window.location.href.includes("localhost:3002") ||
  window.location.href.includes("tab-tangle.com") ||
  window.location.href.includes("tab-tangle.web.app")
) {
  // Establish connection to background script
  const port = browser.runtime.connect({ name: "dashboard-bridge" });

  // Listen for messages from background script
  port.onMessage.addListener((message: any) => {
    if (message.type === "TABS_UPDATE") {
      // Forward to dashboard web page
      const eventDetail = {
        type: "TABS_UPDATE",
        data: {
          tabs: message.tabs,
          timestamp: message.timestamp,
        },
      };

      // Firefox requires cloneInto to pass data across security boundaries
      const detail =
        typeof cloneInto !== "undefined"
          ? cloneInto(eventDetail, window)
          : eventDetail;

      window.dispatchEvent(
        new CustomEvent("extensionMessage", {
          detail: detail,
        })
      );
    }
  });

  // Listen for messages from dashboard web page
  window.addEventListener("dashboardMessage", (event: any) => {
    const { type, ...data } = event.detail;

    if (type === "REQUEST_TABS") {
      // Forward to background script
      port.postMessage({ type: "REQUEST_TABS" });
    } else if (type === "CLOSE_TAB") {
      // Forward tab close request
      port.postMessage({ type: "CLOSE_TAB", tabId: data.tabId });
    } else if (type === "CLOSE_TABS") {
      // Forward multiple tab close request
      port.postMessage({ type: "CLOSE_TABS", tabIds: data.tabIds });
    } else if (type === "SWITCH_TO_TAB") {
      // Forward tab switch request
      port.postMessage({ type: "SWITCH_TO_TAB", tabId: data.tabId });
    } else if (type === "RESTORE_TABS") {
      // Forward tab restore request
      port.postMessage({ type: "RESTORE_TABS", tabs: data.tabs });
    }
  });

  // Handle port disconnect
  port.onDisconnect.addListener(() => {
    // Connection lost - could reconnect here if needed
  });

  // Notify dashboard that extension is connected
  const connectedDetail = {
    type: "EXTENSION_CONNECTED",
    data: { connected: true },
  };

  // Firefox requires cloneInto to pass data across security boundaries
  const detail =
    typeof cloneInto !== "undefined"
      ? cloneInto(connectedDetail, window)
      : connectedDetail;

  window.dispatchEvent(
    new CustomEvent("extensionMessage", {
      detail: detail,
    })
  );
}

// Listen for direct messages from background script (for other functionality)
browser.runtime.onMessage.addListener(
  (
    message: any,
    sender: Runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    if (message.type === "GET_PAGE_INFO") {
      const pageInfo = {
        title: document.title,
        url: window.location.href,
        timestamp: Date.now(),
      };
      sendResponse(pageInfo);
    }
    return true;
  }
);
