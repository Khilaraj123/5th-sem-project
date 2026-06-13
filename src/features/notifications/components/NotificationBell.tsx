import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, ExternalLink, ShieldAlert } from "lucide-react";
import { useNotificationStore } from "../store/notificationStore";
import { useSignalRNotifications } from "../hooks/useNotifications";
import NotificationItem from "./NotificationItem";

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Connect to SignalR Notification Hub
  const { isConnected } = useSignalRNotifications();

  const { notifications, markAsRead, markAllAsRead, getUnreadCount } =
    useNotificationStore();
  const unreadCount = getUnreadCount();
  const latestNotifications = notifications.slice(0, 5);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors focus:outline-none"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Connection status dot */}
      <span
        className={`absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${
          isConnected ? "bg-emerald-500" : "bg-gray-300"
        }`}
        title={
          isConnected
            ? "Connected to Notification Hub"
            : "Notification Hub Disconnected"
        }
      />

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-gray-205 dark:border-zinc-800 rounded-2xl shadow-xl z-55 overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-xs">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline"
              >
                <Check size={12} />
                Mark all as read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="divide-y divide-gray-100 dark:divide-zinc-850 max-h-80 overflow-y-auto p-3 space-y-2">
            {latestNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-400 flex flex-col items-center justify-center gap-2">
                <ShieldAlert
                  size={28}
                  className="text-gray-300 dark:text-zinc-700"
                />
                <span className="text-xs">No notifications yet.</span>
              </div>
            ) : (
              latestNotifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  onMarkRead={markAsRead}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800/80 p-3 flex justify-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-650 dark:text-zinc-300 hover:text-violet-650 dark:hover:text-violet-450 transition-colors"
            >
              <span>View All History</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
