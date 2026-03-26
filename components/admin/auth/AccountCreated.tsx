"use client";

import React from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/admin/auth/AuthLayout";
import { PrimaryButton } from "@/components/admin/auth/AuthComponents";

const AccountCreatedScreen: React.FC = () => {
  return (
    <AuthLayout bgImage="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80">
      <div className="flex flex-col items-center text-center">
        {/* Illustration */}
        <div className="relative w-44 h-40 mb-6 flex items-end justify-center">
          {/* Document card */}
          <div className="relative w-28 h-32 bg-gray-50 border border-gray-200 rounded-xl shadow-sm flex flex-col justify-end p-3 mr-2">
            {/* Purple checkmark badge */}
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shadow-md">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            {/* Lines */}
            <div className="space-y-1.5">
              {[100, 75, 85].map((w, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full bg-gray-200"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          </div>

          {/* Person figure */}
          <div className="flex flex-col items-center pb-1">
            {/* Head */}
            <div className="w-5 h-5 rounded-full bg-gray-700 mb-1" />
            {/* Body */}
            <div className="w-8 h-7 bg-gray-700 rounded-t-lg" />
            {/* Feet */}
            <div className="flex gap-1 mt-0.5">
              <div className="w-3 h-2 bg-gray-500 rounded-sm" />
              <div className="w-3 h-2 bg-gray-500 rounded-sm" />
            </div>
          </div>
        </div>

        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-3">
          Account Created!
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-xs">
          Your new account is ready. You can now log in and start managing your
          practice, schedules, and client data.
        </p>

        <Link href="/auth/login" className="w-full">
          <PrimaryButton type="button">Go to Login</PrimaryButton>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default AccountCreatedScreen;