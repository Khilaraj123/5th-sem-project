import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, CheckCircle, Bell, Send } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';
import NotificationItem from '../components/NotificationItem';
import useAuth from '../../auth/hooks/useAuth';

export const NotificationHistoryPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, clearAll, getUnreadCount } = useNotificationStore();
  const { user } = useAuth();
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const unreadCount = getUnreadCount();

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Notification History</h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Manage your in-app alerts and notifications preferences.
          </p>
        </div>

        {user?.role === 'instructor' || user?.role === 'admin' ? (
          <Link
            to="/notifications/send"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-750 text-white text-xs font-bold rounded-lg transition-colors"
          >
            <Send size={14} />
            Send System Alerts
          </Link>
        ) : null}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-zinc-850 pb-3">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setFilter(opt)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border capitalize transition-all ${
                filter === opt
                  ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-800 dark:border-zinc-800'
                  : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-650 dark:text-zinc-350 hover:bg-gray-50 dark:hover:bg-zinc-800'
              }`}
            >
              {opt} {opt === 'unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
            </button>
          ))}
        </div>

        {/* Global Action Buttons */}
        <div className="flex gap-2.5">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
            >
              <CheckCircle size={14} />
              Mark all read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-xs font-bold text-red-650 dark:text-red-400 hover:underline"
            >
              <Trash2 size={14} />
              Clear history
            </button>
          )}
        </div>
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-205 dark:border-zinc-800 rounded-2xl bg-gray-50/20 dark:bg-zinc-900/10">
            <Bell className="mx-auto text-gray-300 dark:text-zinc-700 mb-3" size={48} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">No notifications</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
              You are all caught up! There are no alerts matching this filter.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationHistoryPage;
