'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import NotificationItem from './NotificationItem';
import type { Notification } from './types';

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'task_expiring',
    title: 'Task Expiring Soon',
    description: "Task 'Fix my laptop' expires in 15 minutes",
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'new_interest',
    title: 'New Interest',
    description: '3 users showed interest in a task',
    time: '2 min ago',
    read: false,
  },
  {
    id: 3,
    type: 'report_alert',
    title: 'Report Alert',
    description: 'A user has been reported',
    time: '2 min ago',
    read: true,
  },
  {
    id: 4,
    type: 'task_expired',
    title: 'Task Expired',
    description: 'A task has expired',
    time: '2 min ago',
    read: true,
  },
  {
    id: 5,
    type: 'report_alert',
    title: 'Report Alert',
    description: 'A user has been reported',
    time: '2 min ago',
    read: true,
  },
  {
    id: 6,
    type: 'task_expired',
    title: 'Task Expired',
    description: 'A task has expired',
    time: '2 min ago',
    read: true,
  },
  {
    id: 7,
    type: 'report_alert',
    title: 'Report Alert',
    description: 'A user has been reported',
    time: '2 min ago',
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
        onClick={() => setNotifications(initialNotifications)}
        className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm"
        title="Refresh"
      >
        <RefreshCw className="w-4 h-4 text-textGray" />
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
      <NotificationItem key={notification.id} notification={notification} />
    ))}
  </div>
</div>
  );
}