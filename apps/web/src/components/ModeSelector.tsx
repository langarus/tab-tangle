import { useState, useEffect, useMemo } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useAuthCtx } from "../common/auth";
import { useGeneralCtx } from "../common/general";

export function ModeSelector() {
  const { user } = useAuthCtx();
  const { tabs, handleCloseGroup } = useGeneralCtx();
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });
  const currentPath = location.pathname;
  const currentMode = location.pathname.split("/")[2] || ""; // Now we need to check the second segment after /app
  const searchParams = location.search as { q?: string; duplicates?: boolean };

  const [searchQuery, setSearchQuery] = useState("");

  // Get current page URL to exclude the dashboard tab itself
  const currentPageUrl = typeof window !== "undefined" ? window.location.href : "";
  const currentPageUrlNormalized = currentPageUrl?.split("?")[0]?.split("#")[0]?.toLowerCase();

  // Calculate filtered tabs for search results
  const filteredTabs = useMemo(() => {
    if (!searchQuery.trim() || !currentPageUrlNormalized) return [];
    const query = searchQuery.toLowerCase().trim();
    return tabs.filter((tab) => {
      if (!tab.url) return false;
      const tabUrlNormalized = tab.url?.split("?")[0]?.split("#")[0]?.toLowerCase();
      if (!tabUrlNormalized || tabUrlNormalized === currentPageUrlNormalized) return false;
      const title = (tab.title || "").toLowerCase();
      const url = (tab.url || "").toLowerCase();
      return title.includes(query) || url.includes(query);
    });
  }, [tabs, searchQuery, currentPageUrlNormalized]);

  // Sync search query with URL params
  useEffect(() => {
    if (currentPath === "/app/filtered" && searchParams?.q) {
      setSearchQuery(searchParams.q);
    } else if (currentPath !== "/app/filtered") {
      setSearchQuery("");
    }
  }, [currentPath, searchParams?.q]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      navigate({
        to: "/app/filtered",
        search: { q: value.trim(), duplicates: searchParams?.duplicates || false },
      });
    } else if (searchParams?.duplicates) {
      navigate({
        to: "/app/filtered",
        search: { duplicates: true, q: "" },
      });
    } else {
      navigate({ to: "/app" });
    }
  };

  const pro = user ? (
    <Link
      to="/app/board"
      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 bg-violet-100 text-violet-700 shadow-sm hover:shadow-md hover:bg-violet-200 border border-violet-200 hover:border-violet-300"
    >
      Board
    </Link>
  ) : // TODO: Re-enable Pro+ feature in the future
  // <Link
  //   to="/app/auth"
  //   className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 bg-violet-100 text-violet-700 shadow-sm hover:shadow-md hover:bg-violet-200 border border-violet-200 hover:border-violet-300"
  // >
  //   Pro+
  // </Link>
  null;

  const handleCloseAllSearch = (e: React.MouseEvent) => {
    if (filteredTabs.length > 0) {
      handleCloseGroup(filteredTabs, e);
      handleSearchChange("");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Search Input */}
      <div className="flex items-center gap-2">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search tabs..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
        {filteredTabs.length > 0 && (
          <button
            onClick={handleCloseAllSearch}
            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
            title={`Close ${filteredTabs.length} matching tab${filteredTabs.length > 1 ? "s" : ""}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Close All ({filteredTabs.length})
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-gray-100 rounded-xl p-1 shadow-sm border border-gray-200">
          <Link to="/app">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                currentPath === "/app" || currentMode === ""
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span className="text-base">🧶</span>
              Timeline
            </button>
          </Link>

          <Link to="/app/windows">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                currentMode === "windows"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span className="text-base">🐾</span>
              Windows
            </button>
          </Link>

          <Link to="/app/domains">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                currentMode === "domains"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span className="text-base">🏷️</span>
              Domains
            </button>
          </Link>
        </div>
        {pro}
      </div>
    </div>
  );
}
