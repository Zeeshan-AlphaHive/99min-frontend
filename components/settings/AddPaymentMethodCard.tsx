"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';

interface AddPaymentMethodCardProps {
  onClick?: () => void;
}

const AddPaymentMethodCard: React.FC<AddPaymentMethodCardProps> = ({
  onClick,
}) => {
  const { tr } = useI18n();
  return (
    <button
      onClick={onClick}
      className="w-full bg-iconBg border-2 border-orange rounded-xl p-6 flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
    >
      <Plus className="w-6 h-6 text-orange" strokeWidth={2.5} />
      <span className="text-orange font-bold text-base">{tr('Add Payment Method')}</span>
    </button>
  );
};

export default AddPaymentMethodCard;

