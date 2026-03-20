import { useCallback } from "react";
import { getAccessToken, silentRefresh } from "@/utils/api/client";

const PUBLIC_PATHS = ["/login", "/auth/signup", "/auth/forgot-password", "/auth/verify-otp"];

export function useAuthFetch() {
  const authFetch = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    // Don't attempt refresh on public pages
    if (typeof window !== "undefined") {
      const isPublicPath = PUBLIC_PATHS.some((p) =>
        window.location.pathname.startsWith(p)
      );
      if (isPublicPath) return fn();
    }

    if (!getAccessToken()) {
      const refreshed = await silentRefresh();
      if (!refreshed) {
        throw new Error("Session expired. Please log in again.");
      }
    }
    return fn();
  }, []);

  return { authFetch };
}