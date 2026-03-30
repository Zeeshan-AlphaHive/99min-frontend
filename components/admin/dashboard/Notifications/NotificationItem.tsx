import React from 'react';
import { AlertTriangle, Clock, MessageSquare, Star } from 'lucide-react';
import type { Notification, NotificationType } from './types';

const iconMap: Record<NotificationType, React.ReactNode> = {
  task_expiring: <Clock className="w-4 h-4" />,
  new_interest: <Star className="w-4 h-4" />,
  new_message: <MessageSquare className="w-4 h-4" />,
  task_expired: <Clock className="w-4 h-4" />,
  report_alert: <AlertTriangle className="w-4 h-4" />,
};

const iconContainerClass: Record<NotificationType, string> = {
  task_expiring: 'bg-orange-100 text-orange-500',
  new_interest: 'bg-orange-100 text-orange-500',
  new_message: 'bg-orange-100 text-orange-500',
  task_expired: 'bg-gray-100 text-gray-400',
  report_alert: 'bg-gray-100 text-gray-400',
};

const rowClass: Record<NotificationType, string> = {
  task_expiring: 'bg-orange-50 border-orange-100',
  new_interest: 'bg-orange-50 border-orange-100',
  new_message: 'bg-orange-50 border-orange-100',
  task_expired: 'bg-white border-gray-100',
  report_alert: 'bg-white border-gray-100',
};

type NotificationItemProps = {
  notification: Notification;
};

export default function NotificationItem({ notification }: NotificationItemProps) {
  const { type, title, description, time } = notification;

  return (
    <div
  className={`flex items-start gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 border rounded-xl transition-colors ${rowClass[type]}`}
>
  {/* Icon */}
  <div
    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${iconContainerClass[type]}`}
  >
    {iconMap[type]}
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