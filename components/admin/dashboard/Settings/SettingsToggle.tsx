'use client';

import React from 'react';

type SettingsToggleProps = {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

export default function SettingsToggle({
  label,
  description,
  enabled,
  onChange,
}: SettingsToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-textBlack">{label}</p>
        {description && <p className="text-xs text-textGray mt-0.5">{description}</p>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
          enabled ? 'bg-orange' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}