"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";
import { TicketIcon } from "./shared";

const AuthScreen: React.FC = () => {
  const t = useTranslations();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="mb-12 flex justify-center"><TicketIcon /></div>
        <div className="w-full mb-6">
          <Link href="/auth/login" className="block">
            <Button variant="primary" size="lg" fullWidth className="hover:opacity-90">{t("auth.login")}</Button>
          </Link>
          <p className="text-center text-textGray text-sm mt-3 font-normal">{t("auth.accessQuickly")}</p>
        </div>
        <div className="w-full">
          <Link href="/auth/signup" className="block">
            <Button variant="secondary" size="lg" fullWidth className="hover:opacity-90">{t("auth.signup")}</Button>
          </Link>
          <p className="text-center text-textGray text-sm mt-3 font-normal">{t("auth.createInSeconds")}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;