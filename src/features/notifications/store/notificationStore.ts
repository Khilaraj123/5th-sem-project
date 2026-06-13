import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NotificationItem, NotificationType, NotificationChannel } from '../types/notification.types';

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (
    title: string,
    message: string,
    type?: NotificationType,
    channel?: NotificationChannel
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (title, message, type = 'info', channel = 'in-app') => {
        const newItem: NotificationItem = {
          id: Math.random().toString(36).substring(7),
          title,
          message,
          type,
          channel,
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          notifications: [newItem, ...state.notifications],
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((item) =>
            item.id === id ? { ...item, isRead: true } : item
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((item) => ({
            ...item,
            isRead: true,
          })),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },

      getUnreadCount: () => {
        return get().notifications.filter((item) => !item.isRead).length;
      },
    }),
    {
      name: 'edulink-notifications-storage', // key in localStorage
    }
  )
);

export default useNotificationStore;
