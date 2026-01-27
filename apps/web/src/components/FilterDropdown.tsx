import { useState, useRef, useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

export function FilterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const searchParams = router.location.search as {
    q?: string;
    duplicates?: boolean;
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

  // Close dropdown when duplicates is toggled
  useEffect(() => {
    if (currentPath === "/app/filtered" && searchParams?.duplicates) {
      setIsOpen(false);
    }
  }, [currentPath, searchParams?.duplicates]);

  const handleShowDuplicates = (show: boolean) => {
    if (show) {
      navigate({
        to: "/app/filtered",
        search: { duplicates: true, q: searchParams?.q || "" },
      });
    } else {
      if (searchParams?.q?.trim()) {
        navigate({
          to: "/app/filtered",
          search: { q: searchParams.q.trim(), duplicates: false },
        });
      } else {
        navigate({ to: "/app" });
      }
    }
    setIsOpen(false);
  };

  const isFilterActive = searchParams?.duplicates;

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
        {isFilterActive && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
            !
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-4">
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
