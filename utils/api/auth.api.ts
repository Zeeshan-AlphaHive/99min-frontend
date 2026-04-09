import { request } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  status?: "active" | "suspended" | "banned" | "deleted";
  avatarUrl: string | null;
  phone: string | null;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    accessToken: string;
  };
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (payload: { name: string; email: string; password: string }) =>
    request<{ success: boolean; message: string }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verifySignupOtp: (payload: { email: string; otp: string }) =>
    request<AuthResponse>(
      "/api/auth/verify-signup-otp",
      { method: "POST", body: JSON.stringify(payload) }
    ),

  resendSignupOtp: (payload: { email: string }) =>
    request<{ success: boolean; message: string }>(
      "/api/auth/resend-signup-otp",
      { method: "POST", body: JSON.stringify(payload) }
    ),

  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request<{ success: boolean; message: string }>("/api/auth/logout", {
      method: "POST",
    }),

  refresh: () =>
    request<AuthResponse>("/api/auth/refresh", {
      method: "POST",
    }),

  forgotPassword: (payload: { email: string }) =>
    request<{ success: boolean; message: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verifyResetOtp: (payload: { email: string; otp: string }) =>
    request<{ success: boolean; message: string }>(
      "/api/auth/verify-reset-otp",
      { method: "POST", body: JSON.stringify(payload) }
    ),

  resetPassword: (payload: {
    email: string;
    newPassword: string;
    confirmPassword: string;
  }) =>
    request<{ success: boolean; message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};