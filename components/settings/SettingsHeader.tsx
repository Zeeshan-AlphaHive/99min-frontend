"use client";
import React from 'react';
import { useTranslations } from 'next-intl';

const SettingsHeader: React.FC = () => {
  const t = useTranslations();
  return (
    <div className="bg-white p-4 border-b border-lightGrey">
      <h1 className="text-3xl font-black text-textBlack mb-2">{t("settings.title")}</h1>
      <p className="text-textGray text-base">{t("settings.subtitle")}</p>
    </div>
  );
};
export default SettingsHeader;