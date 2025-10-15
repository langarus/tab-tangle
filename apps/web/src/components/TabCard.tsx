import React from "react";
import { TabInfo } from "../types";
import { useGeneralCtx } from "../common/general";

interface TabCardProps {
  tab: TabInfo;
  onClose: (
    tabId: number,
    e: React.MouseEvent,
    selectedTabs?: TabInfo[],
    isSelectMode?: boolean,
    resetSelection?: () => void
  ) => void;
  className?: string;
}

export function TabCard({ tab, onClose, className = "" }: TabCardProps) {
  const {
    selectedTabs,
    handleSelectTabs,
    handleDeselectTabs,
    resetSelection,
    isSelectMode,
  } = useGeneralCtx();

  const isSelected = selectedTabs.some(
    (selectedTab) => selectedTab.id === tab.id
  );

  const handleTabClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isSelectMode) {
      // In select mode, clicking toggles selection
      if (isSelected) {
        handleDeselectTabs([tab]);
      } else {
        handleSelectTabs([tab]);
      }
    } else {
      // Normal mode - navigate to tab
      if (!tab.id) return;
      window.dispatchEvent(
        new CustomEvent("dashboardMessage", {
          detail: { type: "SWITCH_TO_TAB", tabId: tab.id },
        })
      );
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSelected) {
      handleDeselectTabs([tab]);
    } else {
      handleSelectTabs([tab]);
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  return (
    <div
      className={`group relative bg-gradient-to-br from-white to-gray-50 border rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ease-out transform hover:-translate-y-1 ${
        isSelected
          ? "border-green-400 bg-gradient-to-br from-green-50 to-green-100 shadow-green-200/50"
          : "border-gray-200 hover:border-gray-300"
      } ${className}`}
    >
      {/* Close button */}
      <button
        onClick={(e) =>
          tab.id &&
          onClose(tab.id, e, selectedTabs, isSelectMode, resetSelection)
        }
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100/80 hover:bg-red-500 text-gray-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
        title="Close tab"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 3L3 9M3 3L9 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Checkbox - shows on hover for unselected tabs only */}
      {!isSelected && (
        <button
          onClick={handleCheckboxClick}
          className="absolute top-3 right-12 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100/80 hover:bg-blue-500 text-gray-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
          title="Select tab"
        >
          <div className="w-3 h-3 border-2 border-current rounded-sm"></div>
        </button>
      )}

      <button
        onClick={handleTabClick}
        className={`block w-full text-left p-5 no-underline group-hover:scale-[1.02] transition-transform duration-300 ${
          isSelectMode ? "cursor-pointer" : "cursor-pointer"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-4 h-4 mt-1 flex-shrink-0 opacity-80">
            {tab.favIconUrl ? (
              <img
                src={tab.favIconUrl}
                alt="Favicon"
                className="w-4 h-4 rounded-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : null}
            <div
              className={`w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full ${tab.favIconUrl ? "hidden" : ""}`}
            ></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-base leading-snug mb-2 truncate pr-4 ${
                isSelected
                  ? "text-green-700"
                  : tab.active
                    ? "text-blue-600"
                    : "text-gray-900"
              }`}
            >
              {tab.title || "Untitled"}
            </h3>
            <p
              className={`text-sm truncate leading-relaxed ${
                isSelected ? "text-green-600" : "text-gray-500"
              }`}
            >
              {tab.url ? getDomainFromUrl(tab.url) : ""}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
