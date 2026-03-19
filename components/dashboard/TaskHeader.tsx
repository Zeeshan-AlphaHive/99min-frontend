"use client";

import React from 'react';
import { Clock } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';

interface TaskHeaderProps {
  title: string;
  price: string;
  urgent?: boolean;
  postedTime?: string;
  timeLeft: string;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  title,
  price,
  urgent = false,
  postedTime = 'Posted just now',
  timeLeft,
}) => {
  const { tr } = useI18n();
  const expiresLabel =
    timeLeft === "Expired" ? tr("Expired") : tr(`Expires in ${timeLeft}`);

  return (
    <div className="bg-white px-6 pt-6 pb-4">
      <div className="flex items-center gap-2 mb-4">
        {urgent && (
          <span className="bg-lightRed text-red text-xs font-bold px-2.5 py-1 rounded-md uppercase">
            {tr("Urgent")}
          </span>
        )}
        <span className="text-textGray text-xs font-medium px-2.5 py-1 rounded-md">
          {tr(postedTime)}
        </span>
      </div>

      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-black text-textBlack flex-1 pr-4">
          {title}
        </h2>
        <div className="text-3xl font-black text-orange">
          ${price}
        </div>
      </div>

      <div className="mb-6">
        <div className="inline-flex items-center border border-[#FF7A0020] gap-2 bg-iconBg text-orange px-4 py-2 rounded-xl">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{expiresLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;

