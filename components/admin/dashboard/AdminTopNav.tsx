"use client";
import {  Search } from 'lucide-react';
import Image from 'next/image';

type AdminTopNavProps = {
  userName?: string;
  roleLabel?: string;
  avatarSrc?: string;
};

export default function AdminTopNav({
  userName = 'Jerremy Hage',
  roleLabel = 'Admin',
  avatarSrc = '/assets/images/user.png',
}: AdminTopNavProps) {
  return (
    <header className="h-[72px] border-b border-gray-200 bg-white flex items-center justify-between px-4 sm:px-6 md:px-8">
      {/* Search Bar */}
      <div className="w-[180px] sm:w-[260px] md:w-[400px]">
        <div className="relative flex items-center w-full h-11 rounded-lg bg-inputBg overflow-hidden focus-within:ring-2 focus-within:ring-orange transition-all">
          <div className="grid place-items-center h-full w-12 text-textGray">
            <Search className="w-5 h-5" />
          </div>
          <input
            className="peer h-full w-full outline-none text-sm text-textBlack bg-transparent pr-2 placeholder-textGray"
            type="text"
            id="search"
            placeholder="Search here..."
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Notification Bell */}
        {/* <button className="relative p-2.5 rounded-full border border-gray-200 text-textGray hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange border-2 border-white rounded-full" />
        </button> */}

        {/* Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-iconBg relative">
            <Image
              src={avatarSrc}
              alt={userName}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
         <div className="flex flex-col">
            <span className="text-sm font-semibold text-textBlack">{userName}</span>
            <span className="text-xs text-textGray font-medium">{roleLabel}</span>
          </div>
          {/* <ChevronDown className="w-4 h-4 text-textGray ml-0 sm:ml-1" /> */}
        </div>
      </div>
    </header>
  );
}