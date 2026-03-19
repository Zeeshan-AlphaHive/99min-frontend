// src/components/auth/OtpModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, OTPInput, IconContainer } from "@/components/ui";
import { AuthPageLayout } from "./shared";
import { authApi } from "@/utils/api/auth.api";
import { otpSchema, OtpFormData } from "@/validators/auth-schema";
import { useI18n } from "@/contexts/i18n-context";

interface OtpModalProps {
  email?: string;
  onBack?: () => void;
  onVerify?: () => void;
  purpose?: "signup" | "password_reset";
}

const OtpModal: React.FC<OtpModalProps> = ({
  email = "",
  onBack,
  onVerify,
  purpose = "signup",
}) => {
  const { tr } = useI18n();
  const [apiError, setApiError] = useState("");
  const [resendSeconds, setResendSeconds] = useState(55);
  const [canResend, setCanResend] = useState(false);

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  const otpValue = watch("otp");

  // Resend countdown
  useEffect(() => {
    if (resendSeconds <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendSeconds]);

  // Wire OTPInput component into react-hook-form
  const handleOtpChange = (code: string) => {
    setValue("otp", code, { shouldValidate: true });
    setApiError("");
  };

  const onSubmit = async (data: OtpFormData) => {
    setApiError("");
    try {
      if (purpose === "signup") {
        await authApi.verifySignupOtp({ email, otp: data.otp });
      } else {
        await authApi.verifyResetOtp({ email, otp: data.otp });
      }
      onVerify?.();
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Invalid OTP");
      setValue("otp", "", { shouldValidate: false });
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;
    setApiError("");
    setCanResend(false);
    setResendSeconds(55);
    try {
      if (purpose === "signup") {
        await authApi.resendSignupOtp({ email });
      } else {
        await authApi.forgotPassword({ email });
      }
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Failed to resend OTP");
    }
  };

  return (
    <AuthPageLayout
      backButtonOnClick={onBack}
      backButtonVariant="circular"
      contentMaxWidth="md"
      contentClassName="pt-4"
    >
      <IconContainer className="mb-6">
        <CheckCircle2 className="w-10 h-10 text-orange" strokeWidth={3} />
      </IconContainer>

      <h1 className="text-3xl font-black text-textBlack mb-4 tracking-tight text-center">
        {tr("Check your email")}
      </h1>

      <p className="text-center text-textGray text-sm font-medium mb-10">
        {tr("We sent a verification code to")}{" "}
        <b className="text-textBlack">{email}</b>
      </p>

      <label className="block text-textBlack text-xs font-bold mb-4 text-center w-full">
        {tr("Enter verification code")}
      </label>

      <form onSubmit={handleSubmit(onSubmit)}>
        <OTPInput
          length={6}
          onChange={handleOtpChange}
          onComplete={handleOtpChange}
          className="mb-2"
        />

        {/* Zod error for OTP format */}
        {errors.otp && (
          <p className="text-red-500 text-xs text-center mb-2">{tr(String(errors.otp.message))}</p>
        )}

        {/* API error */}
        {apiError && (
          <p className="text-red-500 text-sm text-center mb-4">{tr(apiError)}</p>
        )}

        <div className="text-center text-textGray text-sm font-medium mb-8">
          <p className="mb-1">{tr("Didn't receive the code?")}</p>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-orange font-semibold underline"
            >
              {tr("Resend code")}
            </button>
          ) : (
            <p className="text-textGray opacity-70">
              {tr("Resend in")} {resendSeconds}s
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? tr("Verifying...") : tr("Verify Code")}
        </Button>
      </form>
    </AuthPageLayout>
  );
};

export default OtpModal;
