import React from "react";
import { TabInfo } from "../types";
import { TabCard } from "./TabCard";

interface TabListProps {
  tabs: TabInfo[];
  onClose?: (tabId: number, e: React.MouseEvent) => void;
}

function TabList({ tabs, onClose }: TabListProps) {
  if (tabs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No tabs received yet</div>
        <div className="text-gray-500 text-sm">
          Make sure your Chrome extension is running and click "Send Tabs to
          Dashboard"
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tabs.map((tab) => (
        <div key={tab.id} className="animate-fade-in">
          <TabCard tab={tab} onClose={onClose || (() => {})} />
        </div>
      ))}
    </div>
  );
}

export default TabList;
