"use client";

import React from 'react';
import TicketIcon from './TicketIcon';
import { useI18n } from '@/contexts/i18n-context';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  ticketSize?: 'sm' | 'md' | 'lg';
  titleSize?: '2xl' | '3xl';
  className?: string;
}

const titleSizeClasses = {
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  ticketSize = 'md',
  titleSize = '3xl',
  className = '',
}) => {
  const { tr } = useI18n();
  return (
    <div className={`flex flex-col items-center mb-6 ${className}`}>
      <TicketIcon size={ticketSize} className={ticketSize === 'sm' ? 'mb-2' : ''} />
      <h1 className={`${titleSizeClasses[titleSize]} font-bold text-textBlack ${ticketSize === 'sm' ? 'mt-4' : 'mt-6'}`}>
        {tr(title)}
      </h1>
      {subtitle && (
        <p className="text-textGray text-sm mt-2 font-normal">
          {tr(subtitle)}
        </p>
      )}
    </div>
  );
};

export default AuthHeader;

