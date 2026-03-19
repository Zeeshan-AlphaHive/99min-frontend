"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AddPaymentMethodCardProps { onClick?: () => void; }

const AddPaymentMethodCard: React.FC<AddPaymentMethodCardProps> = ({ onClick }) => {
  const t = useTranslations();
  return (
    <button onClick={onClick} className="w-full bg-iconBg border-2 border-orange rounded-xl p-6 flex items-center justify-center gap-3 hover:opacity-90 transition-opacity">
      <Plus className="w-6 h-6 text-orange" strokeWidth={2.5} />
      <span className="text-orange font-bold text-base">{t("payment.addCard")}</span>
    </button>
  );
};

export default AddPaymentMethodCard;