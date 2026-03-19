"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ApiConversation } from "@/utils/api/message.api";
import { useI18n } from "@/contexts/i18n-context";

interface MessageThreadCardProps {
  conversation: ApiConversation;
  onClick?: () => void;
}

const MessageThreadCard: React.FC<MessageThreadCardProps> = ({
  conversation,
  onClick,
}) => {
  const { tr } = useI18n();
  const { otherParticipant, lastMessage, unreadCount, isOnline } = conversation;
  const hasUnread = unreadCount > 0;

  const timestamp = lastMessage?.createdAt
    ? formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })
    : "";

  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-left"
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 bg-orange rounded-full flex items-center justify-center">
          <span className="text-white text-lg font-bold">
            {otherParticipant.initial.toUpperCase()}
          </span>
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <h3
            className={`text-base ${
              hasUnread
                ? "font-bold text-textBlack"
                : "font-semibold text-textBlack"
            }`}
          >
            {otherParticipant.name}
          </h3>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className="text-textGray text-xs">{tr(timestamp)}</span>
            {hasUnread && (
              <div className="w-5 h-5 bg-orange rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {unreadCount}
                </span>
              </div>
            )}
          </div>
        </div>
        <p
          className={`text-sm line-clamp-2 ${
            hasUnread ? "text-textBlack font-medium" : "text-textGray"
          }`}
        >
          {lastMessage?.body ?? tr("No messages yet")}
        </p>
      </div>
    </button>
  );
};

export default MessageThreadCard;