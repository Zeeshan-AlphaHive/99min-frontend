"use client";

import React from 'react';
import { useI18n } from '@/contexts/i18n-context';

interface TaskTagsProps {
  tags: string[];
}

const TaskTags: React.FC<TaskTagsProps> = ({ tags }) => {
  const { tr } = useI18n();
  return (
    <div>
      <h3 className="text-textBlack font-bold text-base mb-3">{tr("Tags")}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="border-lightGrey border text-gray text-sm font-medium px-3 py-1.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TaskTags;

