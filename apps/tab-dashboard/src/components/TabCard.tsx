import React from "react";
import { TabInfo } from "../types";

interface TabCardProps {
  tab: TabInfo;
  onClose: (tabId: number, e: React.MouseEvent) => void;
  className?: string;
}

export function TabCard({ tab, onClose, className = "" }: TabCardProps) {
  const handleTabClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!tab.id) return;

    // Send tab switch request directly to extension
    window.dispatchEvent(
      new CustomEvent("dashboardMessage", {
        detail: { type: "SWITCH_TO_TAB", tabId: tab.id },
      }),
    );
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
      className={`group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 ease-out transform hover:-translate-y-1 ${className}`}
    >
      <button
        onClick={(e) => tab.id && onClose(tab.id, e)}
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

      <button
        onClick={handleTabClick}
        className="block w-full text-left p-5 no-underline group-hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
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
                tab.active ? "text-blue-600" : "text-gray-900"
              }`}
            >
              {tab.title || "Untitled"}
            </h3>
            <p className="text-gray-500 text-sm truncate leading-relaxed">
              {tab.url ? getDomainFromUrl(tab.url) : ""}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
