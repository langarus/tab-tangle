import React from "react";
import { TabInfo } from "../types";
import { TabCard } from "./TabCard";

interface WindowsViewProps {
  tabs: TabInfo[];
  onClose: (tabId: number, e: React.MouseEvent) => void;
  onCloseGroup: (tabsToClose: TabInfo[], e: React.MouseEvent) => void;
}

// List of fun Japanese dish names
const japaneseDishes = [
  "Sushi",
  "Ramen",
  "Okonomiyaki",
  "Takoyaki",
  "Katsudon",
  "Tempura",
  "Udon",
  "Soba",
  "Onigiri",
  "Yakitori",
  "Tonkatsu",
  "Karaage",
  "Gyoza",
  "Shabu-shabu",
  "Sukiyaki",
  "Mochi",
  "Taiyaki",
  "Dorayaki",
  "Chawanmushi",
  "Unagi",
  "Donburi",
  "Miso Soup",
  "Nikujaga",
  "Oden",
  "Yakiniku",
  "Zosui",
  "Omurice",
  "Tamagoyaki",
  "Korokke",
  "Menchi Katsu",
];

export function WindowsView({ tabs, onClose, onCloseGroup }: WindowsViewProps) {
  // Keep a mapping of windowId to generated name
  const windowNames: Record<string, string> = {};
  const usedNames = new Set<string>();
  const nameCounts: Record<string, number> = {};

  function getUniqueDishName(windowId: string) {
    // Try to assign an unused name
    for (const dish of japaneseDishes) {
      if (!usedNames.has(dish)) {
        usedNames.add(dish);
        windowNames[windowId] = dish;
        return dish;
      }
    }
    // If all names are used, append a number
    const base = japaneseDishes[parseInt(windowId, 10) % japaneseDishes.length];
    nameCounts[base] = (nameCounts[base] || 1) + 1;
    const uniqueName = `${base} ${nameCounts[base]}`;
    windowNames[windowId] = uniqueName;
    return uniqueName;
  }

  const groupedTabs = tabs.reduce(
    (acc, tab) => {
      const windowId = tab.windowId;
      if (windowId && !acc[windowId]) acc[windowId] = [];
      if (windowId) acc[windowId].push(tab);
      return acc;
    },
    {} as Record<number, TabInfo[]>
  );

  return (
    <div className="space-y-8">
      {Object.entries(groupedTabs).map(([windowIdStr, windowTabs]) => {
        if (!windowTabs || windowTabs.length === 0) return null;
        // Generate or reuse a unique name for this window
        const windowName =
          windowNames[windowIdStr] || getUniqueDishName(windowIdStr);
        return (
          <div
            key={windowIdStr}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {windowName} Window
                    </h2>
                    <p className="text-sm text-gray-600">
                      {windowTabs.length}{" "}
                      {windowTabs.length === 1 ? "tab" : "tabs"}
                    </p>
                  </div>
                </div>
                <button
                  title="Close all tabs in this window"
                  onClick={(e) => onCloseGroup(windowTabs, e)}
                  className="h-8 w-8 rounded-lg bg-white/80 hover:bg-red-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all duration-200 hover:shadow-sm"
                >
                  <svg
                    className="h-4 w-4"
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
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
                {windowTabs.map((tab) => (
                  <div key={tab.id} className="animate-fade-in">
                    <TabCard tab={tab} onClose={onClose} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
