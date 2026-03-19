"use client";

import React from "react";
import { Bell, MessageSquare, Clock, InfoIcon, CheckCheck } from "lucide-react";
import { ApiNotification } from "@/utils/api/notification.api";
import { useI18n } from "@/contexts/i18n-context";

// Map API types → display config
const NOTIFICATION_CONFIG: Record<
  ApiNotification["type"],
  { icon: React.ReactNode; iconBgColor: string }

> = {
  new_response: {
    icon: <Bell className="w-5 h-5 text-orange-500" />,
    iconBgColor: "bg-[#FFF5EB]",
  },
  response_accepted: {
    icon: <CheckCheck className="w-5 h-5 text-green-500" />,
    iconBgColor: "bg-[#DCFCE7]",
  },
  task_expiring: {
    icon: <Clock className="w-5 h-5 text-red-500" />,
    iconBgColor: "bg-[#FEF2F2]",
  },
  task_expired: {
    icon: <Clock className="w-5 h-5 text-gray-400" />,
    iconBgColor: "bg-[#F3F4F6]",
  },
  task_cancelled: {
    icon: <Bell className="w-5 h-5 text-gray-400" />,
    iconBgColor: "bg-[#F3F4F6]",
  },
  new_message: {
    icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
    iconBgColor: "bg-[#EFF6FF]",
  },
  system: {
    icon: <InfoIcon className="w-5 h-5 text-green-500" />,
    iconBgColor: "bg-[#DCFCE7]",
  },
  marketing: {
    icon: <Bell className="w-5 h-5 text-purple-500" />,
    iconBgColor: "bg-[#F5F3FF]",
  },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

interface NotificationCardProps {
  notification: ApiNotification;
  onClick?: (notification: ApiNotification) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
}) => {
  const { tr } = useI18n();
  const config = NOTIFICATION_CONFIG[notification.type] ?? NOTIFICATION_CONFIG.system;
  const isUnread = !notification.read;

  return (
    <div
      onClick={() => onClick?.(notification)}
      className={`${
        isUnread ? "bg-iconBg" : "bg-white"
      } p-4 flex items-start gap-4 cursor-pointer transition-colors`}
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.iconBgColor}`}
      >
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          {config.icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-textBlack font-bold mb-1">{tr(notification.title)}</h4>
        <p className="text-textGray text-sm mb-1 line-clamp-2">{tr(notification.body)}</p>
        <p className="text-textGray text-xs">{tr(timeAgo(notification.createdAt))}</p>
      </div>

      {/* Unread dot */}
      {isUnread && (
        <div className="w-2 h-2 bg-orange rounded-full shrink-0 mt-2" />
      )}
    </div>
  );
};

export default NotificationCard;