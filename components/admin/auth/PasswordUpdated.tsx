"use client";

import React from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/admin/auth/AuthLayout";
import { PrimaryButton } from "@/components/admin/auth/AuthComponents";

const PasswordUpdatedScreen: React.FC = () => {
  return (
    <AuthLayout bgImage="/assets/images/updated.png" bgAlt="Password updated background">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">
          Password Updated!
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-xs">
          Your password has been changed successfully. You&apos;re now protected
          with your new credentials.
        </p>

        <Link href="/admin/auth/login" className="w-full">
          <PrimaryButton type="button">Back to Login</PrimaryButton>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default PasswordUpdatedScreen;