"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button, Input } from "@/components/ui";
import { AuthPageLayout, AuthHeader, AuthFormFooter } from "./shared";
import OtpModal from "@/components/auth/OtpModal";
import { authApi } from "@/utils/api/auth.api";
import { signupSchema, SignupFormData } from "@/validators/auth-schema";

const SignupScreen: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [email, setEmailState] = useState("");
  const [apiError, setApiError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema), mode: "onChange",
  });

  const onSubmit = async (data: SignupFormData) => {
    setApiError("");
    try {
      await authApi.signup({ name: data.name.trim(), email: data.email, password: data.password });
      setEmailState(data.email); setStep("otp");
    } catch (err: unknown) { setApiError(err instanceof Error ? err.message : t("auth.signupFailed")); }
  };

  if (step === "otp") return <OtpModal email={email} onBack={() => setStep("form")} onVerify={() => router.push("/auth/login")} purpose="signup" />;

  return (
    <AuthPageLayout backButtonHref="/" contentMaxWidth="sm">
      <AuthHeader title={t("auth.createAccount")} subtitle={t("auth.joinSubtitle")} ticketSize="sm" titleSize="2xl" className="mb-6" />
      <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input type="text" id="name" label={t("auth.name")} placeholder={t("auth.namePlaceholder")} {...register("name")} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Input type="email" id="email" label={t("auth.email")} placeholder={t("auth.emailPlaceholder")} {...register("email")} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Input type="password" id="password" label={t("auth.password")} placeholder={t("auth.createPasswordPlaceholder")} showPasswordToggle {...register("password")} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <Input type="password" id="confirm-password" label={t("auth.confirmPassword")} placeholder={t("auth.confirmPasswordPlaceholder")} showPasswordToggle {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
        {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>}
        <div className="pt-4">
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={!isValid || isSubmitting}>
            {isSubmitting ? t("auth.creatingAccount") : t("auth.createAccount")}
          </Button>
        </div>
        <AuthFormFooter question={t("auth.alreadyHaveAccount")} linkText={t("auth.login")} linkHref="/auth/login" className="mt-4" />
        <div className="pt-8 pb-4"><p className="text-center text-textGray text-xs px-4 leading-relaxed opacity-80">{t("auth.termsNotice")}</p></div>
      </form>
    </AuthPageLayout>
  );
};

export default SignupScreen;