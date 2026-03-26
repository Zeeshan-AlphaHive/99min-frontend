import React from 'react';
import { ArrowUpRight } from 'lucide-react';

type EcosystemPulseStatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconContainerClassName: string;
  changePercent: string;
  changeLabel: string;
};

export default function EcosystemPulseStatCard({
  title,
  value,
  icon,
  iconContainerClassName,
  changePercent,
  changeLabel,
}: EcosystemPulseStatCardProps) {
  return (
    <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-textGray mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-textBlack">{value}</h3>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconContainerClassName}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-center text-sm">
        <span className="text-green-500 font-medium flex items-center">
          <ArrowUpRight className="w-4 h-4 mr-1" /> {changePercent}
        </span>
        <span className="text-textGray ml-1">{changeLabel}</span>
      </div>
    </div>
  );
}
