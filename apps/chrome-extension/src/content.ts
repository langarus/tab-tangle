// Content script for Chrome extension
console.log("Tab Dashboard Extension content script loaded");

// Only run on dashboard pages
if (window.location.href.includes("localhost:3002")) {
  console.log("Dashboard page detected, setting up communication bridge");

  // Establish connection to background script
  const port = chrome.runtime.connect({ name: "dashboard-bridge" });

  // Listen for messages from background script
  port.onMessage.addListener((message) => {
    if (message.type === "TABS_UPDATE") {
      // Forward to dashboard web page
      window.dispatchEvent(
        new CustomEvent("extensionMessage", {
          detail: {
            type: "TABS_UPDATE",
            data: {
              tabs: message.tabs,
              timestamp: message.timestamp,
            },
          },
        }),
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
    console.log("Connection to background script lost");
  });

  // Notify dashboard that extension is connected
  window.dispatchEvent(
    new CustomEvent("extensionMessage", {
      detail: {
        type: "EXTENSION_CONNECTED",
        data: { connected: true },
      },
    }),
  );
}

// Listen for direct messages from background script (for other functionality)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PAGE_INFO") {
    const pageInfo = {
      title: document.title,
      url: window.location.href,
      timestamp: Date.now(),
    };
    sendResponse(pageInfo);
  }
  return true;
});
