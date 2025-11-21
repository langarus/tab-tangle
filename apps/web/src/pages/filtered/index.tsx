import { useRouterState } from "@tanstack/react-router";
import { useGeneralCtx } from "../../common/general";
import { TabCard } from "../../components/TabCard";
import { TabInfo } from "../../types";
import { useMemo, useEffect, useRef } from "react";

export function FilteredResults() {
  const router = useRouterState();
  const searchParams = router.location.search as {
    q?: string;
    duplicates?: boolean;
  };
  const {
    tabs,
    handleClose,
    handleSelectTabs,
    handleDeselectTabs,
    resetSelection,
    selectedTabs,
  } = useGeneralCtx();
  const lastSelectedTabIds = useRef<string>("");

  // Get current page URL to exclude the dashboard tab itself
  const currentPageUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const currentPageUrlNormalized = currentPageUrl
    ?.split("?")[0]
    ?.split("#")[0]
    ?.toLowerCase();
  if (!currentPageUrlNormalized) return null;

  // Filter out the current tab (dashboard tab) from all tabs
  // Also filter out tabs without IDs or URLs - these can't be closed and cause UI issues
  const filteredTabs = useMemo(() => {
    return tabs.filter((tab) => {
      if (!tab.id || !tab.url) return false; // Filter out tabs without IDs or URLs
      const tabUrlNormalized = tab?.url
        ?.split("?")[0]
        ?.split("#")[0]
        ?.toLowerCase();
      if (!tabUrlNormalized) return false;
      return tabUrlNormalized !== currentPageUrlNormalized;
    });
  }, [tabs, currentPageUrlNormalized]);

  // Detect duplicates (excluding current tab)
  const duplicateGroups = useMemo(() => {
    const urlMap = new Map<string, TabInfo[]>();

    filteredTabs.forEach((tab) => {
      if (!tab.url) return;
      const normalizedUrl = tab?.url
        ?.split("?")[0]
        ?.split("#")[0]
        ?.toLowerCase();
      if (!normalizedUrl) return;
      if (!urlMap.has(normalizedUrl)) {
        urlMap.set(normalizedUrl, []);
      }
      urlMap.get(normalizedUrl)!.push(tab);
    });

    // Filter to only groups with duplicates
    const duplicates: Map<string, TabInfo[]> = new Map();
    urlMap.forEach((group, url) => {
      if (group.length > 1) {
        duplicates.set(url, group);
      }
    });

    return duplicates;
  }, [tabs]);

  // Get all duplicate tabs (excluding primary ones)
  const extraDuplicateTabs = useMemo(() => {
    const extras: TabInfo[] = [];

    duplicateGroups.forEach((group) => {
      // Sort by lastAccessed (most recent first), then by active status
      const sorted = [...group].sort((a, b) => {
        if (a.active && !b.active) return -1;
        if (!a.active && b.active) return 1;
        const aTime = a.lastAccessed || 0;
        const bTime = b.lastAccessed || 0;
        return bTime - aTime;
      });

      const extrasInGroup = sorted.slice(1);
      extras.push(...extrasInGroup);
    });

    return extras;
  }, [duplicateGroups]);

  // Create a stable string representation of the extra duplicate tab IDs
  const extraDuplicateTabIdsString = useMemo(() => {
    return extraDuplicateTabs
      .map((t) => t.id)
      .filter(Boolean)
      .sort((a, b) => (a || 0) - (b || 0))
      .join(",");
  }, [extraDuplicateTabs.map((t) => t.id).join(",")]);

  // Auto-select duplicate extras when duplicates view is active
  useEffect(() => {
    if (searchParams?.duplicates) {
      // Only select if the tab IDs are different from what we last selected
      if (
        extraDuplicateTabIdsString !== lastSelectedTabIds.current &&
        extraDuplicateTabs.length > 0
      ) {
        // Clear current selection and set to only extra duplicates
        resetSelection();
        handleSelectTabs(extraDuplicateTabs);
        lastSelectedTabIds.current = extraDuplicateTabIdsString;
      }
    } else {
      // Reset selection when not in duplicates view
      if (lastSelectedTabIds.current) {
        resetSelection();
        lastSelectedTabIds.current = "";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.duplicates, extraDuplicateTabIdsString]);

  // Filter tabs based on search query (excluding current tab)
  const searchFilteredTabs = useMemo(() => {
    if (searchParams?.duplicates) {
      // Show all tabs that are duplicates (both primary and extras)
      const allDuplicateTabs: TabInfo[] = [];
      duplicateGroups.forEach((group) => {
        allDuplicateTabs.push(...group);
      });
      return allDuplicateTabs;
    }

    if (searchParams?.q) {
      const query = searchParams.q.toLowerCase().trim();
      return filteredTabs.filter((tab) => {
        const title = (tab.title || "").toLowerCase();
        const url = (tab.url || "").toLowerCase();
        return title.includes(query) || url.includes(query);
      });
    }

    return [];
  }, [filteredTabs, searchParams, duplicateGroups]);

  // Check if a tab is a primary duplicate
  const isPrimaryDuplicate = (tab: TabInfo) => {
    if (!tab.url || !searchParams?.duplicates) return false;
    const normalizedUrl = tab.url?.split("?")[0]?.split("#")[0]?.toLowerCase();
    if (!normalizedUrl) return false;
    const group = duplicateGroups.get(normalizedUrl);
    if (!group || group.length <= 1) return false;

    const sorted = [...group].sort((a, b) => {
      if (a.active && !b.active) return -1;
      if (!a.active && b.active) return 1;
      const aTime = a.lastAccessed || 0;
      const bTime = b.lastAccessed || 0;
      return bTime - aTime;
    });

    return sorted[0]?.id === tab?.id;
  };

  // Group duplicates for display
  const groupedDuplicates = useMemo(() => {
    if (!searchParams?.duplicates) return null;

    const groups: Array<{ url: string; tabs: TabInfo[]; primary: TabInfo }> =
      [];

    duplicateGroups.forEach((group, url) => {
      const sorted = [...group].sort((a, b) => {
        if (a.active && !b.active) return -1;
        if (!a.active && b.active) return 1;
        const aTime = a.lastAccessed || 0;
        const bTime = b.lastAccessed || 0;
        return bTime - aTime;
      });
      groups.push({
        url,
        tabs: sorted,
        primary: sorted[0] || ({} as TabInfo),
      });
    });

    return groups;
  }, [duplicateGroups, searchParams?.duplicates]);

  // Get checkbox state for a group (deselected, all selected, partially selected)
  const getGroupCheckboxState = (groupTabs: TabInfo[]) => {
    const selectedTabIds = new Set(
      selectedTabs.map((t) => t.id).filter(Boolean),
    );

    const selectedCount = groupTabs.filter(
      (tab) => tab.id && selectedTabIds.has(tab.id),
    ).length;

    if (selectedCount === 0) return "deselected";
    if (selectedCount === groupTabs.length) return "all-selected";
    return "partially-selected";
  };

  // Handle group checkbox click
  const handleGroupCheckboxClick = (groupTabs: TabInfo[]) => {
    const state = getGroupCheckboxState(groupTabs);

    if (state === "all-selected") {
      // Deselect all tabs in the group
      handleDeselectTabs(groupTabs);
    } else {
      // Select all tabs in the group (deselect first to avoid duplicates)
      handleDeselectTabs(groupTabs);
      handleSelectTabs(groupTabs);
    }
  };

  if (searchParams?.duplicates) {
    // Show duplicates grouped by URL
    if (groupedDuplicates && groupedDuplicates.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No duplicates found</div>
          <div className="text-gray-500 text-sm">All your tabs are unique</div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {groupedDuplicates?.map((group) => {
          const checkboxState = getGroupCheckboxState(group.tabs);
          return (
            <div
              key={group.url}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {group.url}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {group.tabs.length} duplicate
                      {group.tabs.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => handleGroupCheckboxClick(group.tabs)}
                    className="flex-shrink-0 w-5 h-5 border-2 rounded flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                    style={{
                      borderColor:
                        checkboxState === "deselected" ? "#d1d5db" : "#2563eb",
                      backgroundColor:
                        checkboxState === "deselected"
                          ? "transparent"
                          : "#2563eb",
                    }}
                  >
                    {checkboxState === "all-selected" && (
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {checkboxState === "partially-selected" && (
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.tabs.map((tab) => {
                    const isPrimary = isPrimaryDuplicate(tab);
                    return (
                      <div key={tab.id} className="relative">
                        <TabCard tab={tab} onClose={handleClose} />
                        {isPrimary && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium z-20">
                            Primary
                          </div>
                        )}
                        {!isPrimary && (
                          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium z-20">
                            Extra
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Show search results
  if (searchParams?.q) {
    if (searchFilteredTabs.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">
            No matching tabs found
          </div>
          <div className="text-gray-500 text-sm">
            Try a different search term
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Search Results
          </h2>
          <p className="text-gray-600">
            Found {searchFilteredTabs.length} tab
            {searchFilteredTabs.length !== 1 ? "s" : ""} matching "
            {searchParams.q}"
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {searchFilteredTabs.map((tab) => (
            <div key={tab.id} className="animate-fade-in">
              <TabCard tab={tab} onClose={handleClose} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
