"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type AdminTopNavProps = {
  userName?: string;
  roleLabel?: string;
  avatarSrc?: string;
};

export default function AdminTopNav({
  userName = "Jerremy Hage",
  roleLabel = "Admin",
  avatarSrc = "/assets/images/user.png",
}: AdminTopNavProps) {
  const [openSearch, setOpenSearch] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpenSearch(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[72px] border-b border-gray-200 bg-white flex items-center justify-between px-4 sm:px-6 md:px-8 relative">

      {/* SEARCH */}
      <div ref={wrapperRef} className="relative flex-1 max-w-[420px]">

        {/* DESKTOP SEARCH BAR */}
        <div className="hidden sm:flex items-center h-11 rounded-lg bg-inputBg overflow-hidden focus-within:ring-2 focus-within:ring-orange transition-all">
          <div className="grid place-items-center w-12 text-textGray">
            <Search className="w-5 h-5" />
          </div>

          <input
            className="h-full w-full outline-none text-sm text-textBlack bg-transparent pr-2 placeholder-textGray"
            type="text"
            placeholder="Search here..."
          />
        </div>

        {/* MOBILE ICON ONLY */}
        <button
          onClick={() => setOpenSearch((prev) => !prev)}
          className="sm:hidden p-2 rounded-lg border border-gray-200 text-textGray"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* DROPDOWN (mobile search) */}
        {openSearch && (
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
        )}
      </div>

      {/* PROFILE */}
      <div className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity">

        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-iconBg">
          <Image
            src={avatarSrc}
            alt={userName}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>

        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-sm font-semibold text-textBlack truncate max-w-[120px]">
            {userName}
          </span>
          <span className="text-xs text-textGray font-medium">
            {roleLabel}
          </span>
        </div>
      </div>
    </header>
  );
}