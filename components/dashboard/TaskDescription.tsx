"use client";

import React from 'react';
import { useI18n } from '@/contexts/i18n-context';

interface TaskDescriptionProps {
  description: string;
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ description }) => {
  const { tr } = useI18n();
  return (
    <div className="mb-6">
      <h3 className="text-textBlack font-bold text-base mb-3">{tr("Description")}</h3>
      <p className="text-textGray text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default TaskDescription;

