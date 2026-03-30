import React from 'react';

type StatCardProps = {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconContainerClassName?: string;
};

export default function StatCard({
  label,
  value,
  icon,
  iconContainerClassName = 'bg-red-100 text-red-400',
}: StatCardProps) {
  return (
    <div className="flex-1 min-w-[160px] bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-xs text-textGray mb-1">{label}</p>
        <p className="text-2xl font-bold text-textBlack">{value}</p>
      </div>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconContainerClassName}`}>
        {icon}
      </div>
    </div>
  );
}