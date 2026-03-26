"use client";

import React from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/admin/auth/AuthLayout";
import { PrimaryButton } from "@/components/admin/auth/AuthComponents";
import Image from "next/image";

const AccountCreatedScreen: React.FC = () => {
  return (
    <AuthLayout bgImage="/assets/images/account.png" bgAlt="Account created background">
      <div className="flex flex-col items-center text-center">
        {/* Illustration */}
        <div className="relative w-44 h-40 mb-6 flex items-end justify-center">
          <Image
            src="/assets/images/illustration.png"
            alt="Account created illustration"
            width={176}
            height={160}
          />
        </div>

       

        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
          Account Created!
        </h1>

        <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-xs">
          Your new account is ready. You can now log in and start managing your
          practice, schedules, and client data.
        </p>

        <Link href="/admin/auth/login" className="w-full">
          <PrimaryButton type="button">Go to Login</PrimaryButton>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default AccountCreatedScreen;