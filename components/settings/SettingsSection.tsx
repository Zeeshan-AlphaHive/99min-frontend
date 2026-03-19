"use client";

import React, { ReactNode } from 'react';
import { useI18n } from '@/contexts/i18n-context';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  const { tr } = useI18n();
  return (
    <div className="mb-8">
      <h3 className=" text-xs font-bold uppercase tracking-wide mb-3">
        {tr(title)}
      </h3>
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {children}
      </div>
    </div>
  );
};

export default SettingsSection;

