import React from 'react';
import { AlertTriangle, Bell, FilePlus2, Flag, UserPlus } from 'lucide-react';
import type { Notification } from './types';

const iconMap: Record<string, React.ReactNode> = {
  user_joined: <UserPlus className="w-4 h-4" />,
  task_created: <FilePlus2 className="w-4 h-4" />,
  task_reported: <Flag className="w-4 h-4" />,
  user_reported: <AlertTriangle className="w-4 h-4" />,
  system: <Bell className="w-4 h-4" />,
};

const iconContainerClass: Record<string, string> = {
  user_joined: 'bg-orange-100 text-orange-500',
  task_created: 'bg-orange-100 text-orange-500',
  task_reported: 'bg-gray-100 text-gray-400',
  user_reported: 'bg-gray-100 text-gray-400',
  system: 'bg-gray-100 text-gray-400',
};

const rowClass: Record<string, string> = {
  user_joined: 'bg-orange-50 border-orange-100',
  task_created: 'bg-orange-50 border-orange-100',
  task_reported: 'bg-white border-gray-100',
  user_reported: 'bg-white border-gray-100',
  system: 'bg-white border-gray-100',
};

type NotificationItemProps = {
  notification: Notification;
};

export default function NotificationItem({ notification }: NotificationItemProps) {
  const { type, title, description, time } = notification;
  const safeType = String(type || "system");

  return (
    <div
  className={`flex items-start gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 border rounded-xl transition-colors ${rowClass[safeType] || rowClass.system}`}
>
  {/* Icon */}
  <div
    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${iconContainerClass[safeType] || iconContainerClass.system}`}
  >
    {iconMap[safeType] || iconMap.system}
  </div>

  {/* Content */}
  <div className="flex-1 min-w-0">
    <p className="text-sm font-semibold text-textBlack">{title}</p>
    <p className="text-xs text-textGray mt-0.5">{description}</p>
  </div>

  {/* Time */}
  <span className="text-xs text-textGray whitespace-nowrap shrink-0 mt-0.5">{time}</span>
</div>
  );
}