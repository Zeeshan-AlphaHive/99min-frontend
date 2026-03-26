import React from 'react';
import { Activity, Trash2, TrendingUp, UserPlus, Zap } from 'lucide-react';

type InvoiceItem = {
  name: string;
  action: string;
  icon: React.ReactNode;
  iconContainerClassName: string;
};

export default function EcosystemPulsePendingInvoices() {
  const items: InvoiceItem[] = [
    {
      name: 'Sarah King',
      action: 'registered account',
      icon: <UserPlus className="w-5 h-5" />,
      iconContainerClassName: 'border border-orange/30 bg-iconBg text-orange',
    },
    {
      name: 'Dave Mills',
      action: 'reported platform issue',
      icon: <Activity className="w-5 h-5" />,
      iconContainerClassName: 'border border-gray-200 bg-lightGrey text-textGray',
    },
    {
      name: 'Anna White',
      action: 'upgraded to Enterprise',
      icon: <TrendingUp className="w-5 h-5" />,
      iconContainerClassName: 'border border-green/30 bg-lightGreen text-green',
    },
    {
      name: 'System',
      action: 'cloud backup success',
      icon: <Zap className="w-5 h-5" />,
      iconContainerClassName: 'border border-gray-200 bg-lightGrey text-textGray',
    },
    {
      name: 'Robert Fox',
      action: 'removed asset #492',
      icon: <Trash2 className="w-5 h-5" />,
      iconContainerClassName: 'border border-red/30 bg-lightRed text-red',
    },
  ];

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col">
      <h3 className="text-lg font-semibold text-textBlack mb-6">Pending Invoices</h3>

      <div className="flex-1 space-y-6">
        {items.map((item) => (
          <div key={`${item.name}-${item.action}`} className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.iconContainerClassName}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-textBlack">{item.name}</p>
              <p className="text-sm text-textGray">{item.action}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="w-full mt-8 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-textBlack hover:bg-gray-50 transition-colors"
      >
        Access Global History
      </button>
    </div>
  );
}
