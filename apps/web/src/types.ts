export interface TabInfo {
  id?: number;
  title?: string;
  url?: string;
  favIconUrl?: string;
  active: boolean;
  windowId: number;
  lastAccessed?: number;
}

export interface NotificationState {
  tabs: TabInfo[];
  visible: boolean;
  timer?: NodeJS.Timeout;
}
