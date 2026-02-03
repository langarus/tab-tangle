import { PropsWithChildren } from "react";
import { useGeneralCtx } from "../common/general";
import { ModeSelector } from "./ModeSelector";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { FilterDropdown } from "./FilterDropdown";
import { ThemeSelector } from "./ThemeSelector";

export const Layout = ({ children }: PropsWithChildren) => {
  const {
    tabs,
    isConnected,
    selectedTabs,
    isSelectMode,
    handleCloseGroup,
    resetSelection,
  } = useGeneralCtx();

  const router = useRouterState();
  const currentPath = router.location.pathname;
  const navigate = useNavigate();

  const handleCloseAll = (e: React.MouseEvent) => {
    // Close all selected tabs
    handleCloseGroup(selectedTabs, e);
    // Reset selection after closing
    resetSelection();
    // Navigate back to home to reset filters (search and duplicates)
    if (currentPath === "/app/filtered") {
      navigate({ to: "/app" });
    }
  };

  const isLandingPage = currentPath === "/";
  const isInfoPage = currentPath === "/app/about" || currentPath === "/app/privacy";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 flex flex-col">
      {!isLandingPage && (
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/app">
                <div className="flex items-center space-x-3">
                  <img
                    src="/img/favicon.svg"
                    alt="Tab Tangle Logo"
                    className="h-14 w-14"
                  />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Tab Tangle
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {tabs.length} open tabs
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex items-center space-x-4">
                <Link
                  to="/app/about"
                  className={`text-sm font-medium transition-colors ${
                    currentPath === "/app/about"
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  About
                </Link>
                <Link
                  to="/app/privacy"
                  className={`text-sm font-medium transition-colors ${
                    currentPath === "/app/privacy"
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  Privacy
                </Link>
                <ThemeSelector />
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isConnected
                      ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                  }`}
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`flex-1 ${!isLandingPage ? "container mx-auto px-6 py-8" : ""}`}>
        {isLandingPage ? (
          children
        ) : (
          <>
            {isConnected && tabs.length > 0 && (
              <div className="mb-8">
                <ModeSelector />
              </div>
            )}
            {!isConnected && !isInfoPage ? (
              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200 mb-2">
                  Getting Started
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-300">
                  <li>Install the Tab Tangle extension</li>
                  <li>
                    Make sure this page is open at https://www.tab-tangle.com/app
                  </li>
                  <li>
                    The extension will automatically connect and display your tabs
                  </li>
                </ol>
              </div>
            ) : (
              children
            )}
          </>
        )}
      </div>

      {/* Floating "Close All" button - only shows in select mode */}
      {isSelectMode && (
        <div className="fixed bottom-8 right-24 z-50">
          <button
            onClick={handleCloseAll}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 font-semibold transform hover:scale-105"
          >
            <svg
              className="h-5 w-5"
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
            Close All ({selectedTabs.length})
          </button>
        </div>
      )}

      {/* Floating Filter Button - only show on main pages, not on about/privacy */}
      {isConnected && tabs.length > 0 && currentPath !== "/app/about" && currentPath !== "/app/privacy" && <FilterDropdown />}

      {/* Footer */}
      {!isLandingPage && (
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 mt-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Tab Tangle. Tame your tabs.
              </div>
              <div className="flex gap-6 text-sm">
                <Link
                  to="/app/about"
                  className={
                    currentPath === "/app/about"
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }
                >
                  About
                </Link>
                <Link
                  to="/app/privacy"
                  className={
                    currentPath === "/app/privacy"
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }
                >
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
