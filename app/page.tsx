"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthScreen from "@/components/auth/AuthScreen";
import { useAuth } from "@/store/auth-context";
import { authApi } from "@/utils/api/auth.api";
import { setAccessToken } from "@/utils/api";

export default function Home() {
  const router = useRouter();
  const { user, accessToken, setAuth } = useAuth();
  const [checkingSession, setCheckingSession] = useState(!user || !accessToken);

  useEffect(() => {
    let isMounted = true;

    if (user && accessToken) {
      router.replace("/dashboard/explore");
      return () => {
        isMounted = false;
      };
    }

    authApi
      .refresh()
      .then((res) => {
        if (!isMounted) return;
        setAccessToken(res.data.accessToken);
        setAuth(res.data.user, res.data.accessToken);
        router.replace("/dashboard/explore");
      })
      .catch(() => {
        if (!isMounted) return;
        setCheckingSession(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user, accessToken, router, setAuth]);

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-textGray text-sm">Loading...</span>
      </div>
    );
  }

  return <AuthScreen />;
}



