import { PropsWithChildren } from "react";
import { useGeneralCtx } from "../common/general";
import { ModeSelector } from "./ModeSelector";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { FilterDropdown } from "./FilterDropdown";

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
    if (currentPath === "/filtered") {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <div className="flex items-center space-x-3">
                {/* <div className="h-8 w-8  rounded-lg flex items-center justify-center"> */}
                <img
                  src="/img/favicon.svg"
                  alt="Tab Tangle Logo"
                  className="h-14 w-14"
                />
                {/* </div> */}
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Tab Tangle
                  </h1>
                  <p className="text-sm text-gray-500">
                    {tabs.length} open tabs
                  </p>
                </div>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors ${
                  currentPath === "/about"
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                About
              </Link>
              <Link
                to="/privacy"
                className={`text-sm font-medium transition-colors ${
                  currentPath === "/privacy"
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Privacy
              </Link>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isConnected
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 container mx-auto px-6 py-8">
        {isConnected && tabs.length > 0 && (
          <div className="mb-8">
            <ModeSelector />
          </div>
        )}
        {!isConnected ? (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Getting Started
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Install the Tab Dashboard Chrome extension</li>
              <li>
                Make sure this page is open at https://www.tab-tangle.com/
              </li>
              <li>
                The extension will automatically connect and start sending tab
                data
              </li>
            </ol>
          </div>
        ) : (
          children
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
      {isConnected && tabs.length > 0 && currentPath !== "/about" && currentPath !== "/privacy" && <FilterDropdown />}

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 mt-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} Tab Tangle. Tame your tabs.
            </div>
            <div className="flex gap-6 text-sm">
              <Link
                to="/about"
                className={
                  currentPath === "/about"
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }
              >
                About
              </Link>
              <Link
                to="/privacy"
                className={
                  currentPath === "/privacy"
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
