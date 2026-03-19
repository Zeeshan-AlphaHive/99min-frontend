// src/components/auth/SignupScreen.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/components/ui";
import { AuthPageLayout, AuthHeader, AuthFormFooter } from "./shared";
import OtpModal from "@/components/auth/OtpModal";
import { authApi } from "@/utils/api/auth.api";
import { signupSchema, SignupFormData } from "@/validators/auth-schema";
import { useI18n } from "@/contexts/i18n-context";

type SignupStep = "form" | "otp";

const SignupScreen: React.FC = () => {
  const { tr } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>("form");
  const [email, setEmailState] = useState(""); // keep email for OTP step
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange", // validate as user types
  });

  const onSubmit = async (data: SignupFormData) => {
    setApiError("");
    try {
      await authApi.signup({ name: data.name.trim(), email: data.email, password: data.password });
      setEmailState(data.email); // save for OTP modal
      setStep("otp");
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Signup failed");
    }
  };

  const handleBack = () => {
    if (step === "otp") setStep("form");
    else router.push("/");
  };

  if (step === "otp") {
    return (
      <OtpModal
        email={email}
        onBack={handleBack}
        onVerify={() => router.push("/auth/login")}
        purpose="signup"
      />
    );
  }

  return (
    <AuthPageLayout backButtonHref="/" contentMaxWidth="sm">
      <AuthHeader
        title="Create Account"
        subtitle="Join 99min to start posting tasks"
        ticketSize="sm"
        titleSize="2xl"
        className="mb-6"
      />

      <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>

        {/* Name */}
        <div>
          <Input
            type="text"
            id="name"
            label="Name"
            placeholder="Your name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{tr(String(errors.name.message))}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Input
            type="email"
            id="email"
            label="Email"
            placeholder="your@email.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{tr(String(errors.email.message))}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Input
            type="password"
            id="password"
            label="Password"
            placeholder="Create a password (min 6 chars)"
            showPasswordToggle
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{tr(String(errors.password.message))}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Input
            type="password"
            id="confirm-password"
            label="Confirm Password"
            placeholder="Confirm your password"
            showPasswordToggle
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{tr(String(errors.confirmPassword.message))}</p>
          )}
        </div>

        {/* API error */}
        {apiError && (
          <p className="text-red-500 text-sm text-center">{tr(apiError)}</p>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? tr("Creating Account...") : tr("Create Account")}
          </Button>
        </div>

        <AuthFormFooter
          question="Already have an account?"
          linkText="Login"
          linkHref="/auth/login"
          className="mt-4"
        />

        <div className="pt-8 pb-4">
          <p className="text-center text-textGray text-xs px-4 leading-relaxed opacity-80">
            {tr("By creating an account you accept our Terms & Privacy Policy.")}
          </p>
        </div>
      </form>
    </AuthPageLayout>
  );
};

export default SignupScreen;
