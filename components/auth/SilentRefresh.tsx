// src/components/auth/SilentRefreshInit.tsx
"use client";

import { useEffect, useState } from "react";
import { silentRefresh } from "@/utils/api/client";

export default function SilentRefreshInit({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    silentRefresh().finally(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-inputBg">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}