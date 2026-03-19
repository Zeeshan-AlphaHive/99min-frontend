"use client";

import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-inputBg flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-black text-orange leading-none mb-4">
            404
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-orange" />
            <h2 className="text-3xl md:text-4xl font-black text-textBlack">
              Page Not Found
            </h2>
          </div>
          <p className="text-lg text-textGray max-w-md mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Illustration or Icon */}
        <div className="mb-12 flex justify-center">
          <div className="w-48 h-48 md:w-64 md:h-64 bg-iconBg rounded-full flex items-center justify-center">
            <Search className="w-24 h-24 md:w-32 md:h-32 text-orange opacity-50" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/dashboard/explore">
            <Button
              variant="primary"
              size="lg"
              className="flex items-center gap-2 min-w-[200px]"
            >
              <Home className="w-5 h-5" />
              Go to Home
            </Button>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-white border border-gray-200 text-textBlack font-bold rounded-xl py-3.5 px-6 hover:bg-gray-50 transition-colors min-w-[200px] justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-textGray text-sm mb-4">You might be looking for:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/dashboard/explore"
              className="text-orange hover:underline font-medium text-sm"
            >
              Explore Tasks
            </Link>
            <Link
              href="/dashboard/create"
              className="text-orange hover:underline font-medium text-sm"
            >
              Create Task
            </Link>
            <Link
              href="/dashboard/subscriptions"
              className="text-orange hover:underline font-medium text-sm"
            >
              Subscriptions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

