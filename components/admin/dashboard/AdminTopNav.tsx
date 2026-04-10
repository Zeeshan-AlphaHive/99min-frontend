"use client";

import { ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type AdminTopNavProps = {
  userName?: string;
  roleLabel?: string;
  avatarSrc?: string;
  onLogout?: () => void;
};

export default function AdminTopNav({
  userName = "Jerremy Hage",
  roleLabel = "Admin",
  avatarSrc = "/assets/images/user.png",
  onLogout,
}: AdminTopNavProps) {
  const [openSearch, setOpenSearch] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpenSearch(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[72px] border-b border-gray-200 bg-white flex items-center justify-between px-4 sm:px-6 md:px-8 relative">

      {/* SEARCH */}
      <div ref={searchRef} className="relative flex-1 max-w-[420px]">

        {/* DESKTOP SEARCH BAR */}
        {/* <div className="hidden sm:flex items-center h-11 rounded-lg bg-inputBg overflow-hidden focus-within:ring-2 focus-within:ring-orange transition-all">
          <div className="grid place-items-center w-12 text-textGray">
            <Search className="w-5 h-5" />
          </div>
          <input
            className="h-full w-full outline-none text-sm text-textBlack bg-transparent pr-2 placeholder-textGray"
            type="text"
            placeholder="Search here..."
          />
        </div> */}

        {/* MOBILE ICON ONLY */}
        {/* <button
          onClick={() => setOpenSearch((prev) => !prev)}
          className="sm:hidden p-2 rounded-lg border border-gray-200 text-textGray"
        >
          <Search className="w-5 h-5" />
        </button> */}

        {/* DROPDOWN (mobile search) */}
        {/* {openSearch && (
          <div className="absolute top-[52px] left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden sm:hidden">
            <div className="p-2">
              <input
                autoFocus
                className="w-full h-10 px-3 text-sm outline-none bg-gray-50 rounded-md"
                placeholder="Type to search..."
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {["Dashboard", "Users", "Settings", "Analytics"].map((item) => (
                <div
                  key={item}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}*/}
      </div> 

      {/* PROFILE */}
      <div ref={profileRef} className="relative">
        <button
          onClick={() => setOpenProfile((prev) => !prev)}
          className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-iconBg">
            <Image
              src={avatarSrc}
              alt={userName}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>

          <div className="hidden sm:flex flex-col leading-tight text-left">
            <span className="text-sm font-semibold text-textBlack truncate max-w-[120px]">
              {userName}
            </span>
            <span className="text-xs text-textGray font-medium">
              {roleLabel}
            </span>
          </div>

          <ChevronDown
            className={`hidden sm:block w-4 h-4 text-textGray transition-transform duration-200 ${
              openProfile ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* PROFILE DROPDOWN */}
        {openProfile && (
          <div className="absolute right-0 top-[calc(100%+10px)] w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <button
              onClick={() => {
                setOpenProfile(false);
                onLogout?.();
              }}
              className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}