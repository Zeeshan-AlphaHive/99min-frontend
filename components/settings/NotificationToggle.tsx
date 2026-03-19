"use client";

import React from 'react';
import { useI18n } from '@/contexts/i18n-context';

interface NotificationToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  label,
  description,
  enabled,
  onChange,
}) => {
  const { tr } = useI18n();
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-1">
        <h4 className="text-textBlack font-medium mb-1">{tr(label)}</h4>
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

export default NotificationToggle;

