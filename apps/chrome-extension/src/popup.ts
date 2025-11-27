// Popup script for Chrome extension
// Browser API - provided by browser-polyfill.js loaded in popup.html
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

let allTabs: TabInfo[] = [];

document.addEventListener("DOMContentLoaded", () => {
  const openDashboardBtn = document.getElementById(
    "openDashboard"
  ) as HTMLButtonElement;
  const tabSearchInput = document.getElementById(
    "tabSearch"
  ) as HTMLInputElement;
  const searchResults = document.getElementById("searchResults") as HTMLElement;
  const closeAllBtn = document.getElementById(
    "closeAllMatching"
  ) as HTMLButtonElement;

  // Get current tab count and all tabs
  updateTabCount();

  // Open dashboard
  openDashboardBtn.addEventListener("click", () => {
    browser.tabs.create({ url: "https://www.tab-tangle.com/app" });
  });

  // Search functionality
  tabSearchInput.addEventListener("input", (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase().trim();
    if (query.length === 0) {
      searchResults.innerHTML = "";
      closeAllBtn.style.display = "none";
      return;
    }

    searchTabs(query);
  });

  // Close all functionality
  closeAllBtn.addEventListener("click", () => {
    const query = tabSearchInput.value.toLowerCase().trim();
    if (query.length === 0) return;

    const matchingTabs = allTabs.filter((tab) => {
      const title = (tab.title || "").toLowerCase();
      const url = (tab.url || "").toLowerCase();
      return title.includes(query) || url.includes(query);
    });

    const tabIds = matchingTabs
      .map((tab) => tab.id)
      .filter((id) => id !== undefined) as number[];

    // console.log("Close all clicked - Query:", query);
    // console.log("Matching tabs:", matchingTabs);
    // console.log("Tab IDs to close:", tabIds);

    if (tabIds.length > 0) {
      browser.runtime.sendMessage(
        {
          type: "CLOSE_TABS",
          tabIds: tabIds,
        },
        () => {
          // Clear search and refresh
          tabSearchInput.value = "";
          searchResults.innerHTML = "";
          closeAllBtn.style.display = "none";
          updateTabCount();
        }
      );
    } else {
      // console.log("No valid tab IDs to close");
    }
  });
});

function updateTabCount(callback?: () => void) {
  const tabCountEl = document.getElementById("tabCount") as HTMLElement;

  browser.runtime.sendMessage({ type: "GET_TABS" }).then((response: any) => {
    allTabs = response?.tabs || [];
    const tabCount = allTabs.length;
    tabCountEl.textContent = `Open tabs: ${tabCount}`;

    // Call the callback after updating the tab data
    if (callback) {
      callback();
    }
  });
}

function searchTabs(query: string) {
  const searchResults = document.getElementById("searchResults") as HTMLElement;
  const closeAllBtn = document.getElementById(
    "closeAllMatching"
  ) as HTMLButtonElement;

  // Filter tabs based on title and URL
  const matchingTabs = allTabs.filter((tab) => {
    const title = (tab.title || "").toLowerCase();
    const url = (tab.url || "").toLowerCase();
    return title.includes(query) || url.includes(query);
  });

  if (matchingTabs.length === 0) {
    searchResults.textContent = "";
    const noResults = document.createElement("div");
    noResults.className = "search-result-item";
    noResults.textContent = "No matching tabs found";
    searchResults.appendChild(noResults);
    closeAllBtn.style.display = "none";
    return;
  }

  // Clear and display matching tabs safely
  searchResults.textContent = "";
  matchingTabs.forEach((tab) => {
    const favicon =
      tab.favIconUrl ||
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><text y='14' font-size='14'>🌐</text></svg>";
    const title = tab.title || "Untitled";
    const url = tab.url || "";
    let domain = "";
    try {
      domain = url ? new URL(url).hostname : "";
    } catch {
      domain = url;
    }

    const resultItem = document.createElement("div");
    resultItem.className = "search-result-item";
    resultItem.dataset.tabId = String(tab.id);

    const faviconImg = document.createElement("img");
    faviconImg.className = "tab-favicon";
    faviconImg.alt = "favicon";
    faviconImg.src = favicon;

    const tabInfo = document.createElement("div");
    tabInfo.className = "tab-info";

    const tabTitle = document.createElement("div");
    tabTitle.className = "tab-title";
    tabTitle.textContent = title;

    const tabUrl = document.createElement("div");
    tabUrl.className = "tab-url";
    tabUrl.textContent = domain;

    tabInfo.appendChild(tabTitle);
    tabInfo.appendChild(tabUrl);

    const closeBtn = document.createElement("button");
    closeBtn.className = "tab-close-btn";
    closeBtn.dataset.tabId = String(tab.id);
    closeBtn.title = "Close tab";
    closeBtn.textContent = "×";

    resultItem.appendChild(faviconImg);
    resultItem.appendChild(tabInfo);
    resultItem.appendChild(closeBtn);

    searchResults.appendChild(resultItem);
  });

  // Show and update close all button
  closeAllBtn.textContent = `Close All (${matchingTabs.length})`;
  closeAllBtn.style.display = "block";

  // Add click handlers for individual tabs and close buttons
  matchingTabs.forEach((tab) => {
    const tabElement = document.querySelector(
      `[data-tab-id="${tab.id}"].search-result-item`
    );
    const closeBtn = document.querySelector(
      `.tab-close-btn[data-tab-id="${tab.id}"]`
    );

    if (tabElement) {
      tabElement.addEventListener("click", (e) => {
        // Don't trigger if clicking on the close button
        if ((e.target as Element).classList.contains("tab-close-btn")) {
          return;
        }

        // For now, clicking on the tab item will switch to it instead of closing
        browser.runtime
          .sendMessage({
            type: "SWITCH_TO_TAB",
            tabId: tab.id,
          })
          .then(() => {
            // console.log("Switch to tab response:", response);
            // Close the popup after switching
            window.close();
          });
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent triggering the tab click
        browser.runtime
          .sendMessage({
            type: "CLOSE_TAB",
            tabId: tab.id,
          })
          .then(() => {
            // console.log("Individual tab close response:", response);
            // Update the tab count and refresh allTabs data, then refresh search
            updateTabCount(() => {
              searchTabs(query);
            });
          });
      });
    }
  });
}
