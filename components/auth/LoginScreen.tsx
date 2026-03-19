// src/components/auth/LoginScreen.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/components/ui";
import { AuthPageLayout, AuthHeader, AuthFormFooter } from "./shared";
import { authApi } from "@/utils/api/auth.api";
import { useAuth } from "@/store/auth-context";
import { setAccessToken } from "@/utils/api";
import { loginSchema, LoginFormData } from "@/validators/auth-schema";
import { useI18n } from "@/contexts/i18n-context";

const LoginScreen: React.FC = () => {
  const { tr } = useI18n();
  const router = useRouter();
  const { setAuth } = useAuth();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

const onSubmit = async (data: LoginFormData) => {
  setApiError("");
  try {
    const res = await authApi.login({ email: data.email, password: data.password });
    setAccessToken(res.data.accessToken);       
    setAuth(res.data.user, res.data.accessToken);
    router.push("/dashboard/explore");
  } catch (err: unknown) {
    setApiError(err instanceof Error ? err.message : "Login failed");
  }
};

  return (
    <AuthPageLayout
      backButtonHref="/"
      contentMaxWidth="sm"
      contentClassName="justify-center"
    >
      <AuthHeader title="Welcome Back" subtitle="Login to continue" />

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
            <Button type="button" variant="link" size="sm">
              {tr("Forgot Password?")}
            </Button>
          </Link>
        </div>

        {/* API error */}
        {apiError && (
          <p className="text-red-500 text-sm text-center mb-4">{tr(apiError)}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? tr("Logging in...") : tr("Login")}
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

