"use client";

import React from 'react';
import { Bell, BellOff, ExternalLink, Flag, UserX, Trash2 } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';

interface ChatMenuProps {
  isMuted: boolean;
  hasTask: boolean;
  onMuteNotifications?: () => void;
  onViewAdDetails?: () => void;
  onBlockUser?: () => void;
  onReportUser?: () => void;
  onDeleteChat?: () => void;
}

const ChatMenu: React.FC<ChatMenuProps> = ({
  isMuted,
  hasTask,
  onMuteNotifications,
  onViewAdDetails,
  onBlockUser,
  onReportUser,
  onDeleteChat,
}) => {
  const { tr } = useI18n();
  return (
    <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg py-2 min-w-[200px] z-50 border border-gray-100">
      <button onClick={onMuteNotifications} className="w-full flex items-center gap-3 text-left px-4 py-3 text-textBlack hover:bg-gray-50 transition-colors">
        {isMuted ? <Bell className="w-5 h-5 text-textGray" /> : <BellOff className="w-5 h-5 text-textGray" />}
        <span className="font-medium">{tr(isMuted ? "Unmute Notifications" : "Mute Notifications")}</span>
      </button>

      {hasTask && (
        <button onClick={onViewAdDetails} className="w-full flex items-center gap-3 text-left px-4 py-3 text-textBlack hover:bg-gray-50 transition-colors border-t border-gray-100">
          <ExternalLink className="w-5 h-5 text-textGray" />
          <span className="font-medium">{tr("View Ad Details")}</span>
        </button>
      )}

      <button onClick={onReportUser} className="w-full flex items-center gap-3 text-left px-4 py-3 text-textBlack hover:bg-gray-50 transition-colors border-t border-gray-100">
        <Flag className="w-5 h-5 text-textGray" />
        <span className="font-medium">{tr("Report User")}</span>
      </button>

      <button onClick={onBlockUser} className="w-full flex items-center gap-3 text-left px-4 py-3 text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">
        <UserX className="w-5 h-5 text-red-500" />
        <span className="font-medium">{tr("Block User")}</span>
      </button>

      <button onClick={onDeleteChat} className="w-full flex items-center gap-3 text-left px-4 py-3 text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">
        <Trash2 className="w-5 h-5 text-red-500" />
        <span className="font-medium">{tr("Delete Chat")}</span>
      </button>
    </div>
  );
};

export default ChatMenu;