import React from "react";
import { TabInfo } from "../types";
import { TabCard } from "./TabCard";

interface DomainsViewProps {
  tabs: TabInfo[];
  onClose: (tabId: number, e: React.MouseEvent) => void;
  onCloseGroup: (tabsToClose: TabInfo[], e: React.MouseEvent) => void;
}

export function DomainsView({ tabs, onClose, onCloseGroup }: DomainsViewProps) {
  const groupedTabs = tabs.reduce(
    (acc, tab) => {
      if (!tab.url) return acc;

      try {
        const urlObj = new URL(tab.url);
        const domain = urlObj.hostname.replace(/^www\./, "");
        if (!acc[domain]) acc[domain] = [];
        acc[domain].push(tab);
      } catch {
        if (!acc["Other"]) acc["Other"] = [];
        acc["Other"].push(tab);
      }
      return acc;
    },
    {} as Record<string, TabInfo[]>,
  );

  // Get favicon URL for domain
  const getFaviconUrl = (domain: string) => {
    if (domain === "Other") return null;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {Object.entries(groupedTabs).map(([domain, domainTabs]) => (
        <div
          key={domain}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 break-inside-avoid"
        >
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center overflow-hidden">
                  {getFaviconUrl(domain) ? (
                    <img
                      src={getFaviconUrl(domain)!}
                      alt={`${domain} favicon`}
                      className="h-6 w-6"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <svg
                    className={`h-5 w-5 text-white ${
                      getFaviconUrl(domain) ? "hidden" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {domain}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {domainTabs.length}{" "}
                    {domainTabs.length === 1 ? "tab" : "tabs"}
                  </p>
                </div>
              </div>
              <button
                title="Close all tabs in this domain"
                onClick={(e) => onCloseGroup(domainTabs, e)}
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
            <div className="flex flex-col gap-4">
              {domainTabs.map((tab) => (
                <div key={tab.id} className="animate-fade-in w-full">
                  <TabCard tab={tab} onClose={onClose} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
