"use client";

import React from 'react';
import { Check } from 'lucide-react';
import { getPasswordRequirementStatus } from '@/utils/password';
import { useI18n } from '@/contexts/i18n-context';

interface PasswordRequirementsProps {
  password: string;
  className?: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  className = '',
}) => {
  const { tr } = useI18n();
  const requirements = getPasswordRequirementStatus(password);

  return (
    <div className={`bg-gray-50 rounded-xl p-5 mb-8 ${className}`}>
      <h3 className="text-textBlack text-xs font-bold mb-3">{tr('Password must contain:')}</h3>
      <ul className="space-y-2">
        {requirements.map((req, index) => (
          <li 
            key={index} 
            className={`flex items-center text-xs font-medium transition-colors duration-200 ${
              req.met 
                ? 'text-green-600' 
                : 'text-textGray opacity-80'
            }`}
          >
            {req.met ? (
              <Check className="w-4 h-4 mr-2.5 text-green-600 shrink-0" strokeWidth={3} />
            ) : (
              <div className="w-1 h-1 bg-gray-400 rounded-full mr-2.5 shrink-0"></div>
            )}
            <span>{tr(req.label)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRequirements;

