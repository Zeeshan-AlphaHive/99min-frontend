"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button, Input } from "@/components/ui";
import { AuthPageLayout, AuthHeader, AuthFormFooter } from "./shared";
import { authApi } from "@/utils/api/auth.api";
import { useAuth } from "@/store/auth-context";
import { setAccessToken } from "@/utils/api";
import { loginSchema, LoginFormData } from "@/validators/auth-schema";

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { setAuth } = useAuth();
  const t = useTranslations();
  const [apiError, setApiError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError("");
    try {
      const res = await authApi.login({ email: data.email, password: data.password });
      setAccessToken(res.data.accessToken);
      setAuth(res.data.user, res.data.accessToken);
      router.push("/dashboard/explore");
    } catch (err: unknown) { setApiError(err instanceof Error ? err.message : t("auth.loginFailed")); }
  };

  return (
    <AuthPageLayout backButtonHref="/" contentMaxWidth="sm" contentClassName="justify-center">
      <AuthHeader title={t("auth.welcomeBack")} subtitle={t("auth.loginToContinue")} />
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Input type="email" id="email" label={t("auth.email")} placeholder={t("auth.emailPlaceholder")} {...register("email")} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="mb-2">
          <Input type="password" id="password" label={t("auth.password")} placeholder={t("auth.passwordPlaceholder")} showPasswordToggle {...register("password")} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div className="flex justify-end mb-6">
          <Link href="/auth/forgot-password"><Button type="button" variant="link" size="sm">{t("auth.forgotPassword")}</Button></Link>
        </div>
        {apiError && <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>}
        <Button type="submit" variant="primary" size="lg" fullWidth disabled={!isValid || isSubmitting}>
          {isSubmitting ? t("auth.loggingIn") : t("auth.loginSubmit")}
        </Button>
        <AuthFormFooter question={t("auth.noAccount")} linkText={t("auth.signup")} linkHref="/auth/signup" className="mt-6" />
      </form>
    </AuthPageLayout>
  );
};

export default LoginScreen;