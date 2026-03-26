import React from 'react';
import { Shield } from 'lucide-react';
import type { RoleCard as RoleCardType } from './types';

type RoleCardProps = {
  card: RoleCardType;
};

export default function RoleCard({ card }: RoleCardProps) {
  return (
    <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-iconBg text-orange">
        <Shield className="w-5 h-5" />
      </div>

      <h3 className="text-base font-semibold text-textBlack">{card.title}</h3>
      <p className="text-sm text-textGray mb-4">{card.activeCount} Active Admins</p>

      <p className="text-sm text-textGray mb-6 flex-1">{card.description}</p>

      <button type="button" className="text-sm font-medium text-orange hover:opacity-80 text-left transition-opacity">
        View Policy
      </button>
    </div>
  );
}
