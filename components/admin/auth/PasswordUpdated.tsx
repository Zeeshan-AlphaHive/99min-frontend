"use client";

import React from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/admin/auth/AuthLayout";
import { PrimaryButton } from "@/components/admin/auth/AuthComponents";


const PasswordUpdatedScreen: React.FC = () => {
  return (
    <AuthLayout bgImage="/assets/images/updated.png" bgAlt="Password updated background">
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center mb-6">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f97316"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
          Password Updated!
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-xs">
          Your password has been changed successfully. You&apos;re now protected
          with your new credentials.
        </p>

        <Link href="/auth/login" className="w-full">
          <PrimaryButton type="button">Back to Login</PrimaryButton>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default PasswordUpdatedScreen;