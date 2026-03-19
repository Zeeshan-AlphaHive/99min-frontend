// ─── Shared request client ────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// In-memory token store — call setAccessToken() after login/refresh
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// ── Silent refresh ────────────────────────────────────────────────────────────
let refreshPromise: Promise<void> | null = null; // prevent parallel refresh calls

export async function silentRefresh(): Promise<boolean> {
  if (refreshPromise) {
    await refreshPromise;
    return accessToken !== null;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include", // sends the httpOnly refreshToken cookie
      });

      if (!res.ok) {
        accessToken = null;
        return;
      }

      const data = await res.json();
      accessToken = data.data.accessToken; // ✅ your backend returns { data: { accessToken } }
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

  // Auto-retry once after silent refresh on 401
  if (res.status === 401) {
    const refreshed = await silentRefresh();

    if (!refreshed) {
      // Refresh cookie also expired — send to login
      window.location.href = "/auth/login";
      throw new Error("Session expired. Please log in again.");
    }

    // Retry original request with new token
    res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: makeHeaders(),
    });
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
}