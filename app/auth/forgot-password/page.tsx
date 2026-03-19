"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button, Input, IconContainer } from "@/components/ui";
import { AuthPageLayout } from "@/components/auth/shared";
import OtpModal from "@/components/auth/OtpModal";
import NewPasswordModal from "@/components/auth/NewPasswordModal";
import PasswordSuccessModal from "@/components/auth/PasswordSuccessModal";
import { authApi } from "@/utils/api";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/validators/auth-schema";

type ForgotPasswordStep = "email" | "otp" | "newPassword" | "success";

const ForgotPasswordScreen: React.FC = () => {
  const t = useTranslations();
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmailState] = useState("");
  const [apiError, setApiError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } =
    useForm<ForgotPasswordFormData>({
      resolver: zodResolver(forgotPasswordSchema),
      mode: "onChange",
    });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setApiError("");
    try {
      await authApi.forgotPassword({ email: data.email });
      setEmailState(data.email);
      setStep("otp");
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : t("auth.failedToSend"));
    }
  };

  const handleBack = () => {
    if (step === "otp") setStep("email");
    else if (step === "newPassword") setStep("otp");
  };

  if (step === "otp") return <OtpModal email={email} onBack={handleBack} onVerify={() => setStep("newPassword")} purpose="password_reset" />;
  if (step === "newPassword") return <NewPasswordModal email={email} onBack={handleBack} onSubmit={() => setStep("success")} />;
  if (step === "success") return <><div className="min-h-screen bg-white" /><PasswordSuccessModal isOpen={true} /></>;

  return (
    <AuthPageLayout backButtonHref="/auth/login" backButtonVariant="circular" contentMaxWidth="md" contentClassName="pt-4">
      <IconContainer className="mb-6">
        <Mail className="w-8 h-8 text-orange" />
      </IconContainer>

      <h1 className="text-3xl font-black text-textBlack mb-4 tracking-tight">
        {t("auth.resetPassword")}
      </h1>

      <p className="text-center text-textGray text-sm leading-relaxed mb-10 max-w-xs font-medium opacity-80">
        {t("auth.resetPasswordDesc")}
      </p>

      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-8">
          <Input
            type="email" id="email"
            label={t("auth.emailAddress")}
            placeholder={t("auth.emailPlaceholder")}
            variant="alt"
            {...register("email")}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {apiError && <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>}

        <Button type="submit" variant="primary" size="md" fullWidth className="mb-10" disabled={!isValid || isSubmitting}>
          {isSubmitting ? t("auth.sending") : t("auth.sendResetCode")}
        </Button>

        <div className="text-center text-textGray text-sm font-medium opacity-80">
          {t("auth.backToLogin")}{" "}
          <Link href="/auth/login">
            <Button type="button" variant="link" size="sm">{t("auth.login")}</Button>
          </Link>
        </div>
      </form>
    </AuthPageLayout>
  );
};

export default ForgotPasswordScreen;