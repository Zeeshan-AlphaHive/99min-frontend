"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/admin/auth/AuthLayout";
import { OtpInput, Countdown, PrimaryButton } from "@/components/admin/auth/AuthComponents";



interface OtpScreenProps {
  email?: string;
  redirectTo?: string;
  purpose?: "signup" | "forgot-password";
}

const OtpScreen: React.FC<OtpScreenProps> = ({
  email = "your email",
  redirectTo,
  purpose = "forgot-password",
}) => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendKey, setResendKey] = useState(0);

  const isComplete = otp.every((d) => d !== "");

  const handleSubmit = async () => {
    if (!isComplete) return;
    setLoading(true);
    setError("");
    try {
      const code = otp.join("");
      console.log("Verify OTP:", code, "purpose:", purpose);
      const dest = redirectTo ?? (purpose === "forgot-password" ? "/auth/new-password" : "/dashboard");
      router.push(dest);
    } catch {
      setError("Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setOtp(Array(4).fill(""));
    setResendKey((k) => k + 1);
    console.log("Resend OTP to:", email);
  };

  return (
    <AuthLayout bgImage="/assets/images/otp.png" bgAlt="OTP verification background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
          OTP Verification
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Enter the verification code we have sent to your email address.
        </p>
      </div>

      <div className="mt-6 mb-2">
        <OtpInput value={otp} onChange={setOtp} />
      </div>

      {error && (
        <p className="text-center text-xs text-red-500 mt-2">{error}</p>
      )}

      <Countdown key={resendKey} seconds={60} />

      <p className="text-center text-sm text-gray-400 mb-6">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          className="font-semibold text-orange-500 hover:text-orange-600 transition-colors"
        >
          Resend
        </button>
      </p>

      <PrimaryButton
        type="button"
        onClick={handleSubmit}
        disabled={!isComplete || loading}
        loading={loading}
      >
        Submit
      </PrimaryButton>
    </AuthLayout>
  );
};

export default OtpScreen;