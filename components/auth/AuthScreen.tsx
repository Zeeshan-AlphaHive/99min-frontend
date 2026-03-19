"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { TicketIcon } from "./shared";
import { useI18n } from "@/contexts/i18n-context";

const AuthScreen: React.FC = () => {
  const { tr } = useI18n();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col items-center">
        
        {/* Top Section: Ticket Graphic */}
        <div className="mb-12 flex justify-center">
          <TicketIcon />
        </div>
  
        {/* Middle Section: Login */}
        <div className="w-full mb-6">
          <Link href="/auth/login" className="block">
            <Button 
              variant="primary"
              size="lg"
              fullWidth
              className="hover:opacity-90"
            >
              {tr("Login")}
            </Button>
          </Link>
          <p className="text-center text-textGray text-sm mt-3 font-normal">
            {tr("Access your account quickly.")}
          </p>
        </div>
  
        {/* Bottom Section: Sign Up */}
        <div className="w-full">
          <Link href="/auth/signup" className="block">
            <Button 
              variant="secondary"
              size="lg"
              fullWidth
              className="hover:opacity-90"
            >
              {tr("Sign Up")}
            </Button>
          </Link>
          <p className="text-center text-textGray text-sm mt-3 font-normal">
            {tr("Create a new account in seconds.")}
          </p>
        </div>
  
      </div>
    </div>
  );
};

export default AuthScreen;
