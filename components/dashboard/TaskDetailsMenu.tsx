"use client";

import React from 'react';
import reportFlag from '@/public/assets/images/reportFlag.svg';
import shareIcon from '@/public/assets/images/shareIcon.svg';
import { useI18n } from '@/contexts/i18n-context';

interface TaskDetailsMenuProps {
  onReport: () => void;
  onShare: () => void;
}

const TaskDetailsMenu: React.FC<TaskDetailsMenuProps> = ({ onReport, onShare }) => {
  const { tr } = useI18n();
  return (
    <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg py-2 min-w-[160px] z-50">
      <button 
        onClick={onReport}
        className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-textBlack hover:bg-gray-50 transition-colors font-medium"
      >
        <img src={reportFlag.src} alt={tr("Report")} className="w-5 h-5" />
        <span className="font-medium text-primarydark">{tr("Report Ad")}</span>
      </button>
      <button 
        onClick={onShare}
        className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-textBlack hover:bg-gray-50 transition-colors font-medium"
      >
        <img src={shareIcon.src} alt={tr("Share")} className="w-5 h-5" />
        <span className="text-orange font-medium">{tr("Share")}</span>
      </button>
    </div>
  );
};

export default TaskDetailsMenu;

