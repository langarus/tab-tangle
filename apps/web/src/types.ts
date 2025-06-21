export interface TabInfo {
  id?: number;
  title?: string;
  url?: string;
  favIconUrl?: string;
  active: boolean;
  windowId: number;
}

export type ViewMode = "all" | "windows" | "domains";

export interface NotificationState {
  tabs: TabInfo[];
  visible: boolean;
  timer?: NodeJS.Timeout;
}
