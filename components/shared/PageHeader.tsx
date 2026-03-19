"use client";

import React, { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/contexts/i18n-context';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightContent?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '7xl': 'max-w-7xl',
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBack,
  rightContent,
  maxWidth = '4xl',
}) => {
  const router = useRouter();
  const { tr } = useI18n();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-20 z-30">
      <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 py-4`}>
        <div className={`flex items-center ${rightContent ? 'justify-between' : 'gap-4'}`}>
          <div className="flex items-center w-full gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label={tr('Go back')}
            >
              <ArrowLeft className="w-6 h-6 text-textBlack" />
            </button>
            <h1 className="text-lg font-bold text-center w-full text-textBlack">{tr(title)}</h1>
          </div>
          {rightContent && <div>{rightContent}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

