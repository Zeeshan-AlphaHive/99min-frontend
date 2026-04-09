'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import NotificationItem from './NotificationItem';
import type { Notification } from './types';
import { fetchAdminNotifications, markAdminNotificationRead, markAllAdminNotificationsRead } from '@/utils/api/admin.notifications.api';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminNotifications({ page: 1, limit: 50 });
      setNotifications(
        res.data.map((n) => ({
          id: n._id,
          type: n.type,
          title: n.title,
          description: n.body,
          time: formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }),
          read: n.read,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const markAllRead = () => {
    markAllAdminNotificationsRead()
      .then(() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))))
      .catch(console.error);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  {/* Header */}
  <div className="flex items-center justify-between mb-4 sm:mb-6">
     <h1 className="text-2xl font-semibold text-textBlack mb-1">Notifications</h1>

    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => load().catch(console.error)}
        className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm"
        title="Refresh"
      >
        <RefreshCw className={`w-4 h-4 text-textGray ${loading ? "animate-spin" : ""}`} />
      </button>

      <button
        type="button"
        onClick={markAllRead}
        disabled={unreadCount === 0}
        className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-textBlack bg-white hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Mark all as read</span>
        <span className="sm:hidden">Mark read</span>
      </button>
    </div>
  </div>

  {/* Notification list */}
  <div className="space-y-2">
    {notifications.map((notification) => (
      <button
        key={notification.id}
        type="button"
        className="w-full text-left"
        onClick={() => {
          if (notification.read) return;
          markAdminNotificationRead(notification.id)
            .then(() =>
              setNotifications((prev) =>
                prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
              )
            )
            .catch(console.error);
        }}
      >
        <NotificationItem notification={notification} />
      </button>
    ))}
  </div>
</div>
  );
}