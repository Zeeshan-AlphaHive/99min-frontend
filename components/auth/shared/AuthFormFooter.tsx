"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui";
import { useI18n } from '@/contexts/i18n-context';

interface AuthFormFooterProps {
  question: string;
  linkText: string;
  linkHref: string;
  className?: string;
}

const AuthFormFooter: React.FC<AuthFormFooterProps> = ({
  question,
  linkText,
  linkHref,
  className = '',
}) => {
  const { tr } = useI18n();
  return (
    <div className={`text-center text-textGray text-sm font-normal ${className}`}>
      {tr(question)}{' '}
      <Link href={linkHref}>
        <Button type="button" variant="link" size="sm" className="ml-1">
          {tr(linkText)}
        </Button>
      </Link>
    </div>
  );
};

export default AuthFormFooter;

