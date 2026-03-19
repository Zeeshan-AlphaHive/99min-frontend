"use client";

import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';

interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, defaultOpen = false }) => {
  const { tr } = useI18n();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-textBlack font-bold pr-4">{tr(question)}</span>
        <ChevronUp
          className={`w-5 h-5 text-textGray shrink-0 transition-transform ${
            isOpen ? '' : 'rotate-180'
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-textGray text-sm leading-relaxed">
          {tr(answer)}
        </div>
      )}
    </div>
  );
};

export default FAQItem;

