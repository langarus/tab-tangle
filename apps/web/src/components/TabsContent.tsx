import { DomainsView } from "./DomainsView";
import { WindowsView } from "./WindowsView";
import TabList from "./TabList";

import { TabInfo, ViewMode } from "../types";
import { match } from "ts-pattern";

type TabsContentProps = {
  tabs: TabInfo[];
  currentMode: ViewMode;
  handleClose: (tabId: number, e: React.MouseEvent) => void;
  handleCloseGroup: (tabsToClose: TabInfo[], e: React.MouseEvent) => void;
  isConnected: boolean;
};

export const TabsContent = ({
  tabs,
  currentMode,
  handleClose,
  handleCloseGroup,
  isConnected,
}: TabsContentProps) => {
  const selectedMode = match(currentMode)
    .with("windows", () => (
      <WindowsView
        tabs={tabs}
        onClose={handleClose}
        onCloseGroup={handleCloseGroup}
      />
    ))
    .with("domains", () => (
      <DomainsView
        tabs={tabs}
        onClose={handleClose}
        onCloseGroup={handleCloseGroup}
      />
    ))
    .with("all", () => <TabList tabs={tabs} onClose={handleClose} />)
    .exhaustive();

  return (
    <div className="relative">
      {isConnected ? (
        selectedMode
      ) : (
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Getting Started
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Install the Tab Dashboard Chrome extension</li>
            <li>Make sure this page is open at https://tab-tangle.web.app/</li>
            <li>
              The extension will automatically connect and start sending tab
              data
            </li>
          </ol>
        </div>
      )}
    </div>
  );
};
