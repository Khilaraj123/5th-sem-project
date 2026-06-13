import React from "react";
import {
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Mail,
  Smartphone,
  Bell,
  Eye,
} from "lucide-react";
import type { NotificationItem as NotificationType } from "../types/notification.types";

interface NotificationItemProps {
  notification: NotificationType;
  onMarkRead?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-emerald-500 shrink-0" size={18} />;
      case "warning":
        return <AlertTriangle className="text-amber-500 shrink-0" size={18} />;
      case "error":
        return <XCircle className="text-red-500 shrink-0" size={18} />;
      case "info":
      default:
        return <Info className="text-blue-500 shrink-0" size={18} />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return (
          <span title="Email">
            <Mail size={12} className="text-gray-400" />
          </span>
        );
      case "push":
        return (
          <span title="Push">
            <Smartphone size={12} className="text-gray-400" />
          </span>
        );
      case "in-app":
      default:
        return (
          <span title="In-App">
            <Bell size={12} className="text-gray-400" />
          </span>
        );
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`p-4 border border-gray-200 dark:border-zinc-800 rounded-xl transition-all flex gap-3 items-start justify-between bg-white dark:bg-zinc-900 ${
        !notification.isRead
          ? "border-l-2 border-l-violet-600 dark:border-l-violet-500 shadow-sm"
          : ""
      }`}
    >
      <div className="flex gap-3 items-start flex-1">
        <div className="mt-0.5">{getIcon(notification.type)}</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`text-xs font-bold text-gray-900 dark:text-white ${!notification.isRead ? "font-black" : ""}`}
            >
              {notification.title}
            </h4>
            <div className="flex items-center gap-1 bg-gray-50 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-gray-150 dark:border-zinc-800">
              {getChannelIcon(notification.channel)}
              <span className="text-[9px] text-gray-400 capitalize">
                {notification.channel}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-550 dark:text-zinc-400 leading-relaxed">
            {notification.message}
          </p>
          <span className="text-[10px] text-gray-400 block">
            {formatTime(notification.createdAt)}
          </span>
        </div>
      </div>

      {!notification.isRead && onMarkRead && (
        <button
          type="button"
          onClick={() => onMarkRead(notification.id)}
          className="p-1 text-gray-400 hover:text-violet-605 hover:bg-gray-50 dark:hover:bg-zinc-850 rounded transition-colors"
          title="Mark as Read"
        >
          <Eye size={14} />
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
