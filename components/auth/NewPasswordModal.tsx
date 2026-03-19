// src/components/auth/NewPasswordModal.tsx
"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, IconContainer } from "@/components/ui";
import { AuthPageLayout, PasswordStrengthMeter, PasswordRequirements } from "./shared";
import { authApi } from "@/utils/api/auth.api";
import { resetPasswordSchema, ResetPasswordFormData } from "@/validators/auth-schema";
import { useI18n } from "@/contexts/i18n-context";

interface NewPasswordModalProps {
  email: string;
  onBack?: () => void;
  onSubmit?: () => void;
}

const NewPasswordModal: React.FC<NewPasswordModalProps> = ({
  email,
  onBack,
  onSubmit,
}) => {
  const { tr } = useI18n();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  // Watch newPassword to pass to strength meter
  const newPasswordValue = watch("newPassword", "");

  const onFormSubmit = async (data: ResetPasswordFormData) => {
    setApiError("");
    try {
      await authApi.resetPassword({
        email,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      onSubmit?.();
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Failed to reset password");
    }
  };

  return (
    <AuthPageLayout
      backButtonOnClick={onBack}
      backButtonVariant="circular"
      contentMaxWidth="md"
    >
      <IconContainer className="mb-6">
        <Lock className="w-8 h-8 text-orange" />
      </IconContainer>

      <h1 className="text-3xl font-black text-textBlack mb-3 tracking-tight text-center">
        {tr("Create new password")}
      </h1>

      <p className="text-center text-textGray text-sm mb-8 leading-relaxed max-w-xs mx-auto opacity-80">
        {tr("Your new password must be different from previously used passwords")}
      </p>

      <form className="w-full" onSubmit={handleSubmit(onFormSubmit)}>

        {/* New Password */}
        <div className="mb-1">
          <Input
            type="password"
            id="new-password"
            label="New Password"
            placeholder="Min 6 characters"
            showPasswordToggle
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{tr(String(errors.newPassword.message))}</p>
          )}
        </div>

        {/* Strength meter reads live value */}
        <PasswordStrengthMeter password={newPasswordValue} />

        {/* Confirm Password */}
        <div className="mb-4">
          <Input
            type="password"
            id="confirm-password"
            label="Confirm Password"
            placeholder="Confirm new password"
            showPasswordToggle
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{tr(String(errors.confirmPassword.message))}</p>
          )}
        </div>

        <PasswordRequirements password={newPasswordValue} />

        {apiError && (
          <p className="text-red-500 text-sm text-center mb-4">{tr(apiError)}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? tr("Resetting...") : tr("Reset Password")}
        </Button>
      </form>
    </AuthPageLayout>
  );
};

export default NewPasswordModal;
