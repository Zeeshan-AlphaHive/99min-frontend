"use client";

import React from 'react';
import { Bell, BellOff, ExternalLink, Flag, UserX, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ChatMenuProps { isMuted: boolean; hasTask: boolean; onMuteNotifications?: () => void; onViewAdDetails?: () => void; onBlockUser?: () => void; onReportUser?: () => void; onDeleteChat?: () => void; }

const ChatMenu: React.FC<ChatMenuProps> = ({ isMuted, hasTask, onMuteNotifications, onViewAdDetails, onBlockUser, onReportUser, onDeleteChat }) => {
  const t = useTranslations();
  return (
    <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg py-2 min-w-[200px] z-50 border border-gray-100">
      <button onClick={onMuteNotifications} className="w-full flex items-center gap-3 text-left px-4 py-3 text-textBlack hover:bg-gray-50 transition-colors">
        {isMuted ? <Bell className="w-5 h-5 text-textGray" /> : <BellOff className="w-5 h-5 text-textGray" />}
        <span className="font-medium">{isMuted ? t("messages.unmuteNotifications") : t("messages.muteNotifications")}</span>
      </button>
      {hasTask && (
        <button onClick={onViewAdDetails} className="w-full flex items-center gap-3 text-left px-4 py-3 text-textBlack hover:bg-gray-50 transition-colors border-t border-gray-100">
          <ExternalLink className="w-5 h-5 text-textGray" /><span className="font-medium">{t("messages.viewAdDetails")}</span>
        </button>
      )}
      <button onClick={onReportUser} className="w-full flex items-center gap-3 text-left px-4 py-3 text-textBlack hover:bg-gray-50 transition-colors border-t border-gray-100">
        <Flag className="w-5 h-5 text-textGray" /><span className="font-medium">{t("messages.reportUser")}</span>
      </button>
      <button onClick={onBlockUser} className="w-full flex items-center gap-3 text-left px-4 py-3 text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">
        <UserX className="w-5 h-5 text-red-500" /><span className="font-medium">{t("messages.blockUser")}</span>
      </button>
      <button onClick={onDeleteChat} className="w-full flex items-center gap-3 text-left px-4 py-3 text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">
        <Trash2 className="w-5 h-5 text-red-500" /><span className="font-medium">{t("messages.deleteChat")}</span>
      </button>
    </div>
  );
};

export default ChatMenu;