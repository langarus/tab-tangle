// Popup script for Chrome extension
document.addEventListener("DOMContentLoaded", () => {
  const statusEl = document.getElementById("status") as HTMLElement;
  const tabCountEl = document.getElementById("tabCount") as HTMLElement;
  const sendTabsBtn = document.getElementById("sendTabs") as HTMLButtonElement;
  const openDashboardBtn = document.getElementById(
    "openDashboard",
  ) as HTMLButtonElement;

  // Check dashboard connection status
  checkDashboardConnection();

  // Get current tab count
  updateTabCount();

  // Send tabs to dashboard
  sendTabsBtn.addEventListener("click", () => {
    sendTabsBtn.disabled = true;
    sendTabsBtn.textContent = "Sending...";

    chrome.runtime.sendMessage(
      { type: "SEND_TABS_TO_DASHBOARD" },
      (response) => {
        sendTabsBtn.disabled = false;
        sendTabsBtn.textContent = "Send Tabs to Dashboard";

        if (response?.success) {
          statusEl.textContent = "Tabs sent successfully!";
          statusEl.className = "status connected";
        } else {
          statusEl.textContent = "Failed to send tabs";
          statusEl.className = "status disconnected";
        }
      },
    );
  });

  // Open dashboard
  openDashboardBtn.addEventListener("click", () => {
    chrome.tabs.create({ url: "http://localhost:3002" });
  });
});

async function checkDashboardConnection() {
  const statusEl = document.getElementById("status") as HTMLElement;

  // Check if extension has active connections to dashboard
  chrome.runtime.sendMessage({ type: "GET_CONNECTION_STATUS" }, (response) => {
    if (response?.connected) {
      statusEl.textContent = "Connected to Dashboard";
      statusEl.className = "status connected";
    } else {
      statusEl.textContent = "Dashboard not connected";
      statusEl.className = "status disconnected";
    }
  });
}

function updateTabCount() {
  const tabCountEl = document.getElementById("tabCount") as HTMLElement;

  chrome.runtime.sendMessage({ type: "GET_TABS" }, (response) => {
    const tabCount = response?.tabs?.length || 0;
    tabCountEl.textContent = `Tabs: ${tabCount}`;
  });
}
