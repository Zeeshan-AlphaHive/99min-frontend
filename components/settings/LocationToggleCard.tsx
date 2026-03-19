"use client";

import React, { ReactNode } from 'react';
import { useI18n } from '@/contexts/i18n-context';

interface LocationToggleCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const LocationToggleCard: React.FC<LocationToggleCardProps> = ({
  icon,
  title,
  description,
  enabled,
  onChange,
}) => {
  const { tr } = useI18n();
  return (
    <div className="bg-white border border-lightGrey rounded-xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-iconBg rounded-lg flex items-center justify-center shrink-0 ">
        <div className=" text-orange">
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-textBlack font-bold mb-1">{tr(title)}</h4>
        <p className="text-textGray text-sm">{tr(description)}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 ${
          enabled ? 'bg-orange' : 'bg-gray-300'
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export default LocationToggleCard;

