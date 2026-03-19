"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import TaskDetailsMenu from './TaskDetailsMenu';
import { useI18n } from '@/contexts/i18n-context';

interface TaskDetailsHeaderProps {
  onBack: () => void;
  onReport?: () => void;
  onShare?: () => void;
}

const TaskDetailsHeader: React.FC<TaskDetailsHeaderProps> = ({ onBack, onReport, onShare }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { tr } = useI18n();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

 const handleReport = () => {
  onReport?.();   
  setIsMenuOpen(false);
};

const handleShare = () => {
  onShare?.();   
  setIsMenuOpen(false);
};

  return (
    <PageHeader
      title={tr("Task Details")}
      onBack={onBack}
      maxWidth="7xl"
      // rightContent={
      //   <div className="relative" ref={menuRef}>
      //     <button
      //       onClick={() => setIsMenuOpen(!isMenuOpen)}
      //       className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
      //     >
      //       <MoreVertical className="w-6 h-6 text-textBlack" />
      //     </button>

      //     {isMenuOpen && (
      //       <TaskDetailsMenu onReport={handleReport} onShare={handleShare} />
      //     )}
      //   </div>
      // }
    />
  );
};

export default TaskDetailsHeader;

