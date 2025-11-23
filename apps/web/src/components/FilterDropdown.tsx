import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useGeneralCtx } from "../common/general";

export function FilterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const searchParams = router.location.search as {
    q?: string;
    duplicates?: boolean;
  };
  const { tabs, handleSelectTabs, resetSelection } = useGeneralCtx();

  // Get current page URL to exclude the dashboard tab itself
  const currentPageUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const currentPageUrlNormalized = currentPageUrl
    ?.split("?")[0]
    ?.split("#")[0]
    ?.toLowerCase();
  if (!currentPageUrlNormalized) return null;

  // Filter out the current tab and get search results count
  const searchResultsCount = useMemo(() => {
    if (!searchParams?.q) return 0;
    const query = searchParams.q.toLowerCase().trim();
    const filteredTabs = tabs.filter((tab) => {
      if (!tab.url) return false;
      const tabUrlNormalized = tab.url
        ?.split("?")[0]
        ?.split("#")[0]
        ?.toLowerCase();
      if (!tabUrlNormalized) return false;
      if (tabUrlNormalized === currentPageUrlNormalized) return false;
      const title = (tab.title || "").toLowerCase();
      const url = (tab.url || "").toLowerCase() || "";
      return title.includes(query) || url.includes(query);
    });
    return filteredTabs.length;
  }, [tabs, searchParams?.q, currentPageUrlNormalized]);

  const handleSelectAllSearch = () => {
    if (!searchParams?.q) return;
    const query = searchParams.q.toLowerCase().trim();
    const filteredTabs = tabs.filter((tab) => {
      if (!tab.url) return false;
      const tabUrlNormalized = tab?.url
        ?.split("?")[0]
        ?.split("#")[0]
        ?.toLowerCase();
      if (tabUrlNormalized === currentPageUrlNormalized) return false;
      const title = (tab.title || "").toLowerCase();
      const url = (tab.url || "").toLowerCase();
      return title.includes(query) || url.includes(query);
    });
    resetSelection();
    handleSelectTabs(filteredTabs);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Sync search query with URL params
  useEffect(() => {
    if (currentPath === "/app/filtered" && searchParams) {
      if (searchParams.q) {
        setSearchQuery(searchParams.q);
      }
      if (searchParams.duplicates) {
        setIsOpen(false);
      }
    } else {
      setSearchQuery("");
    }
  }, [currentPath, searchParams]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      navigate({
        to: "/app/filtered",
        search: { q: value.trim(), duplicates: false },
      });
    } else if (searchParams?.duplicates) {
      // Keep duplicates view if it was active
      navigate({
        to: "/app/filtered",
        search: { duplicates: true, q: "" },
      });
    } else {
      // Go back to home if no filters
      navigate({ to: "/app" });
    }
  };

  const handleShowDuplicates = (show: boolean) => {
    if (show) {
      navigate({
        to: "/app/filtered",
        search: { duplicates: true, q: searchQuery || "" },
      });
    } else {
      if (searchQuery.trim()) {
        navigate({
          to: "/app/filtered",
          search: { q: searchQuery.trim(), duplicates: false },
        });
      } else {
        navigate({ to: "/app" });
      }
    }
    setIsOpen(false);
  };

  const isFilterActive = searchParams?.q || searchParams?.duplicates;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center font-semibold transform hover:scale-105 ${
          isFilterActive
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
        }`}
        title="Filters"
      >
        {isFilterActive ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        )}
        {isFilterActive && !searchParams?.q && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
            !
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-4">
            {/* Search Input */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Search tabs
                </label>
                {searchParams?.q && searchResultsCount > 0 && (
                  <button
                    onClick={handleSelectAllSearch}
                    className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded-full transition-colors flex items-center gap-1.5"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Select All ({searchResultsCount})
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by title or URL..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Show Duplicates Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Show duplicates
                </label>
                <p className="text-xs text-gray-500">
                  Auto-select duplicate tabs to close
                </p>
              </div>
              <button
                onClick={() => handleShowDuplicates(!searchParams?.duplicates)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  searchParams?.duplicates ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    searchParams?.duplicates ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
