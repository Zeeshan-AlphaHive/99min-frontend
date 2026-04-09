// ─── Shared request client ────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const PUBLIC_PATHS = ["/auth/login", "/auth/signup", "/auth/forgot-password", "/auth/verify-otp", "/admin/auth/login",   
  "/admin/auth/forgot-password",
  "/admin/auth/verify-otp",
  "/admin/auth/reset-password",];

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// ── Silent refresh ────────────────────────────────────────────────────────────
let refreshPromise: Promise<void> | null = null;

export async function silentRefresh(): Promise<boolean> {
  // Don't attempt refresh on public/auth pages — no valid cookie expected
  if (typeof window !== "undefined") {
    const isPublicPath = PUBLIC_PATHS.some((p) => window.location.pathname.startsWith(p));
    if (isPublicPath) return false;
  }

  if (refreshPromise) {
    await refreshPromise;
    return accessToken !== null;
  }

  refreshPromise = (async () => {
    try {
      const isAdminArea =
        typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
      const refreshEndpoint = isAdminArea ? "/api/admin/auth/refresh" : "/api/auth/refresh";

      const res = await fetch(`${BASE_URL}${refreshEndpoint}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        accessToken = null;
        return;
      }

      const data = await res.json();
      accessToken = data.data.accessToken;
    } catch {
      accessToken = null;
    } finally {
      refreshPromise = null;
    }
  })();

  await refreshPromise;
  return accessToken !== null;
}

// ── Request with auto-retry on 401 ───────────────────────────────────────────
export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const makeHeaders = (): Record<string, string> => ({
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers as Record<string, string>),
  });

  let res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: makeHeaders(),
  });

if (res.status === 401) {
  // Don't try to refresh on auth endpoints — just let the error bubble
  const isAuthEndpoint = endpoint.includes("/api/auth/") ||   endpoint.includes("/api/admin/auth/");
  
  if (!isAuthEndpoint) {
    const refreshed = await silentRefresh();
    if (!refreshed) {
      if (typeof window !== "undefined") {
        const isPublicPath = PUBLIC_PATHS.some((p) =>
          window.location.pathname.startsWith(p)
        );
        if (!isPublicPath) {
          const isAdminArea = window.location.pathname.startsWith("/admin");
          window.location.href = isAdminArea ? "/admin/auth/login" : "/auth/login";
        }
      }
      throw new Error("Session expired. Please log in again.");
    }

    res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: makeHeaders(),
    });
  }
}
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
}