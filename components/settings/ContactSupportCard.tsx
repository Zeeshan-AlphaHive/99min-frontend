"use client";

import React, { ReactNode } from 'react';
import { useI18n } from '@/contexts/i18n-context';

interface ContactSupportCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

const ContactSupportCard: React.FC<ContactSupportCardProps> = ({
  icon,
  title,
  description,
  onClick,
}) => {
  const { tr } = useI18n();
  const descriptionText = description.includes("@") ? description : tr(description);
  return (
    <button
      onClick={onClick}
      className="w-full bg-inputBg rounded-xl p-4 flex items-center gap-4 hover:bg-gray-100 transition-colors text-left"
    >
      <div className="text-orange shrink-0 bg-iconBg rounded-xl p-2   "><span className="">{icon}</span></div>
      <div className="flex-1">
        <h4 className="text-textBlack font-bold mb-1">{tr(title)}</h4>
        <p className="text-textGray text-sm">{descriptionText}</p>
      </div>
    </button>
  );
};

export default ContactSupportCard;


