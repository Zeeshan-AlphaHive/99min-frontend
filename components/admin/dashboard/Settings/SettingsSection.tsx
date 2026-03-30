import React from 'react';

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-base font-semibold text-textBlack mb-5">{title}</h2>
      {children}
    </div>
  );
}