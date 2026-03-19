"use client";

import React from 'react';
import { CreditCard, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PaymentMethodCardProps { cardType: 'visa'|'mastercard'|'amex'|'discover'; last4: string; expiryMonth: string; expiryYear: string; isDefault: boolean; onSetDefault?: () => void; onDelete?: () => void; }

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ cardType, last4, expiryMonth, expiryYear, isDefault, onSetDefault, onDelete }) => {
  const t = useTranslations();
  const cardTypeLabel = cardType.charAt(0).toUpperCase() + cardType.slice(1);
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0"><CreditCard className="w-5 h-5 text-textGray" /></div>
      <div className="flex-1 min-w-0">
        <div className="text-textBlack font-medium mb-1">{cardTypeLabel} •••• {last4}</div>
        <div className="text-textGray text-sm">{t("payment.expires")} {expiryMonth}/{expiryYear}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {isDefault
          ? <button className="px-3 py-1.5 bg-orange text-white text-xs font-bold rounded-lg" disabled>{t("payment.default")}</button>
          : <button onClick={onSetDefault} className="px-3 py-1.5 bg-gray-200 text-textBlack text-xs font-bold rounded-lg hover:bg-gray-300 transition-colors">{t("payment.setDefault")}</button>}
        <button onClick={onDelete} className="p-2 hover:bg-gray-50 rounded-lg transition-colors" aria-label={t("payment.remove")}><Trash2 className="w-4 h-4 text-red" /></button>
      </div>
    </div>
  );
};

export default PaymentMethodCard;