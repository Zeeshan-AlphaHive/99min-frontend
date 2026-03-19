"use client";

import React from 'react';
import { calculatePasswordStrength } from '@/utils/password';
import { useI18n } from '@/contexts/i18n-context';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  className = '',
}) => {
  const { tr } = useI18n();
  if (!password) return null;

  const strength = calculatePasswordStrength(password);

  return (
    <div className={`mb-6 mt-2 ${className}`}>
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-textGray text-xs font-medium opacity-80">{tr('Password strength')}</span>
        <span className={`text-xs font-bold ${
          strength.strength === 'weak' ? 'text-red-500' :
          strength.strength === 'medium' ? 'text-yellow-500' :
          'text-green-500'
        }`}>
          {tr(strength.label)}
        </span>
      </div>
      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${strength.color} rounded-full transition-all duration-300`}
          style={{ 
            width: `${(strength.score / 6) * 100}%` 
          }}
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;

