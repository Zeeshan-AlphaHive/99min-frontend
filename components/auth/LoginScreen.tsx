// src/components/auth/LoginScreen.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/components/ui";
import { Toast } from "@/components/ui/Toast"; // 👈 add this
import { AuthPageLayout, AuthHeader, AuthFormFooter } from "./shared";
import { authApi } from "@/utils/api/auth.api";
import { useAuth } from "@/store/auth-context";
import { setAccessToken } from "@/utils/api";
import { loginSchema, LoginFormData } from "@/validators/auth-schema";
import { useI18n } from "@/contexts/i18n-context";

interface ToastState {
  message: string;
  type: "error" | "success" | "warning";
}

const LoginScreen: React.FC = () => {
  const { tr } = useI18n();
  const router = useRouter();
  const { setAuth } = useAuth();
  const t = useTranslations();
  const [toast, setToast] = useState<ToastState | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const showToast = (message: string, type: ToastState["type"] = "error") => {
    setToast(null); // reset first so re-triggering animates fresh
    setTimeout(() => setToast({ message, type }), 10);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await authApi.login({ email: data.email, password: data.password });
      setAccessToken(res.data.accessToken);
      setAuth(res.data.user, res.data.accessToken);
      router.push("/dashboard/explore");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";

      if (message.includes("No account found")) {
        showToast("No account found with this email. Please sign up.", "error");
      } else if (message.includes("not verified")) {
        showToast("Please verify your email first. Check your inbox for the OTP.", "warning");
      } else if (message.includes("Google") || message.includes("Facebook")) {
        showToast(message, "warning");
      } else if (message.includes("Invalid email or password")) {
        showToast("Incorrect password. Please try again.", "error");
      } else {
        showToast(message || "Login failed. Please try again.", "error");
      }
    }
  };

  return (
    <AuthPageLayout backButtonHref="/" contentMaxWidth="sm" contentClassName="justify-center">
      {/* Toast renders outside the form flow, top-right */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={5000}
          onClose={() => setToast(null)}
        />
      )}

      <AuthHeader title={t("auth.welcomeBack")} subtitle={t("auth.loginToContinue")} />
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>

        {/* Email */}
        <div className="mb-4">
          <Input
            type="email"
            id="email"
            label="Email"
            placeholder="your@email.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-2">
          <Input
            type="password"
            id="password"
            label="Password"
            placeholder="Enter your password"
            showPasswordToggle
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{tr(String(errors.password.message))}</p>
          )}
        </div>

        <div className="flex justify-end mb-6">
          <Link href="/auth/forgot-password">
            <Button type="button" variant="link" size="sm">{t("auth.forgotPassword")}</Button>
          </Link>
        </div>
        <Button type="submit" variant="primary" size="lg" fullWidth disabled={!isValid || isSubmitting}>
          {isSubmitting ? t("auth.loggingIn") : t("auth.loginSubmit")}
        </Button>

        <AuthFormFooter
          question="No account?"
          linkText="Sign Up"
          linkHref="/auth/signup"
          className="mt-6"
        />
      </form>
    </AuthPageLayout>
  );
};

export default LoginScreen;

