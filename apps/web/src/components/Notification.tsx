import { NotificationState } from "../types";

interface NotificationProps {
  notification: NotificationState | null;
  onUndo: () => void;
}

export function Notification({ notification, onUndo }: NotificationProps) {
  if (!notification?.visible) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 flex items-center gap-4 z-50 border border-gray-300 dark:border-gray-800 animate-fade-in">
      <div className="flex items-center gap-2">
        <svg
          className="h-5 w-5 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <span className="text-gray-700 dark:text-gray-200">
          Closed {notification.tabs.length} tab
          {notification.tabs.length > 1 ? "s" : ""}.
        </span>
      </div>
      <button
        className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
        onClick={onUndo}
      >
        Undo
      </button>
    </div>
  );
}
