"use client";

import React from 'react';
import { useI18n } from '@/contexts/i18n-context';

const SettingsHeader: React.FC = () => {
  const { tr } = useI18n();
  return (
    <div className=" bg-white p-4 border-b border-lightGrey">
      <h1 className="text-3xl font-black text-textBlack mb-2">{tr("Settings")}</h1>
      <p className="text-textGray text-base">{tr("Manage your account")}</p>
    </div>
  );
};

export default SettingsHeader;

