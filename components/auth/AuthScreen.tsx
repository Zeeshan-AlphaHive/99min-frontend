"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { TicketIcon } from "./shared";
import { useI18n } from "@/contexts/i18n-context";
import LanguageDropdown from "@/components/dashboard/LanguageDropdown";
import { Check } from "lucide-react";
import en from "@/messages/en.json";

const AuthScreen: React.FC = () => {
  const { tr } = useI18n();
  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10">
      <div className="absolute top-6 left-6 z-40">
        {/* <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-lightGreen text-green">
          <Check className="w-4 h-4" strokeWidth={3} />
          {tr(en.auth.freeLabel)}
        </span> */}
      </div>

      {/* Language Dropdown - Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageDropdown />
      </div>

      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="mb-10 flex justify-center">
          <TicketIcon size="lg" />
        </div>

        <div className="w-full">
          <Link href="/auth/login" className="block">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="uppercase tracking-wider hover:opacity-90"
            >
              {tr(en.auth.login)}
            </Button>
          </Link>

          <div className="mt-4 flex items-center justify-center text-textGray text-sm font-medium flex-wrap gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-2">
              <Check className="w-4 h-4 text-green" strokeWidth={3} />
              {tr(en.auth.freeLabel)}
            </span>
            <span aria-hidden>•</span>
            <span>{tr(en.auth.noHiddenCosts)}</span>
            <span aria-hidden>•</span>
            <span>{tr(en.auth.cancelAnytime)}</span>
          </div>
        </div>

        <div className="w-full mt-8">
          <Link href="/auth/signup" className="block">
            <Button variant="secondary" size="lg" fullWidth className="hover:opacity-90">
              {tr(en.auth.createFreeAccountNow)}
            </Button>
          </Link>

          <p className="text-center text-textGray text-sm mt-3 font-normal">
            {tr(en.auth.registerIn30Seconds)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;