// Popup script for Chrome extension
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
    chrome.tabs.create({ url: "https://www.tab-tangle.com" });
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
      chrome.runtime.sendMessage(
        {
          type: "CLOSE_TABS",
          tabIds: tabIds,
        },
        (response) => {
          // console.log("Close tabs response:", response);
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

  chrome.runtime.sendMessage({ type: "GET_TABS" }, (response) => {
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
    searchResults.innerHTML =
      '<div class="search-result-item">No matching tabs found</div>';
    closeAllBtn.style.display = "none";
    return;
  }

  // Display matching tabs
  const resultsHTML = matchingTabs
    .map((tab) => {
      const favicon =
        tab.favIconUrl ||
        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><text y='14' font-size='14'>🌐</text></svg>";
      const title = tab.title || "Untitled";
      const url = tab.url || "";
      const domain = url ? new URL(url).hostname : "";

      return `
        <div class="search-result-item" data-tab-id="${tab.id}">
          <img src="${favicon}" class="tab-favicon" alt="favicon" />
          <div class="tab-info">
            <div class="tab-title">${title}</div>
            <div class="tab-url">${domain}</div>
          </div>
          <button class="tab-close-btn" data-tab-id="${tab.id}" title="Close tab">×</button>
        </div>
      `;
    })
    .join("");

  searchResults.innerHTML = resultsHTML;

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
        chrome.runtime.sendMessage(
          {
            type: "SWITCH_TO_TAB",
            tabId: tab.id,
          },
          (response) => {
            // console.log("Switch to tab response:", response);
            // Close the popup after switching
            window.close();
          }
        );
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent triggering the tab click
        chrome.runtime.sendMessage(
          {
            type: "CLOSE_TAB",
            tabId: tab.id,
          },
          (response) => {
            // console.log("Individual tab close response:", response);
            // Update the tab count and refresh allTabs data, then refresh search
            updateTabCount(() => {
              searchTabs(query);
            });
          }
        );
      });
    }
  });
}
