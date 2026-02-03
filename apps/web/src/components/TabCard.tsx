import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { TabInfo } from "../types";
import { useGeneralCtx } from "../common/general";
import { getDomainFromUrl } from "../utils/url";

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

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isSelected = selectedTabs.some(
    (selectedTab) => selectedTab.id === tab.id
  );

  useEffect(() => {
    if (showTooltip && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const tooltipWidth = 320; // max-w-md is ~320px
      const left = rect.left + rect.width / 2 - tooltipWidth / 2;
      const top = rect.top - 8; // marginBottom: 8px

      // Adjust if tooltip would go off screen
      const adjustedLeft = Math.max(
        10,
        Math.min(left, window.innerWidth - tooltipWidth - 10)
      );

      setTooltipPosition({
        top: top,
        left: adjustedLeft,
      });
    }
  }, [showTooltip]);

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    // Show tooltip after 1 second delay
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    // Clear timeout if mouse leaves before delay completes
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    setShowTooltip(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

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

  return (
    <>
      <div
        ref={cardRef}
        className={`group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ease-out transform hover:-translate-y-1 ${
          isSelected
            ? "border-amber-400 dark:border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 shadow-amber-200/50 dark:shadow-amber-900/30"
            : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
        } ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Close button */}
        <button
          onClick={(e) =>
            tab.id &&
            onClose(tab.id, e, selectedTabs, isSelectMode, resetSelection)
          }
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100/80 dark:bg-gray-800/80 hover:bg-red-500 text-gray-500 dark:text-gray-400 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
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
            className="absolute top-3 right-12 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100/80 dark:bg-gray-800/80 hover:bg-amber-500 text-gray-500 dark:text-gray-400 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
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
                    ? "text-amber-700 dark:text-amber-400"
                    : tab.active
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {tab.title || "Untitled"}
              </h3>
              <p
                className={`text-sm truncate leading-relaxed ${
                  isSelected ? "text-amber-600 dark:text-amber-400" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {tab.url ? getDomainFromUrl(tab.url) : ""}
              </p>
            </div>
          </div>
        </button>
      </div>
      {/* Tooltip - Rendered via portal to avoid overflow clipping */}
      {showTooltip &&
        tab.title &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-[9999] bg-gray-900 text-white text-sm rounded-lg shadow-2xl overflow-hidden pointer-events-none px-3 py-2 max-w-md"
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform: "translateY(-100%)",
            }}
          >
            <div className="font-semibold mb-1">{tab.title}</div>
            {/* {tab.url && (
              <div className="text-xs text-gray-300 opacity-90 break-all">
                {tab.url}
              </div>
            )} */}
          </div>,
          document.body
        )}
    </>
  );
}
