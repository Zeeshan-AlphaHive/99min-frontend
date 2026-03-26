"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthLayout } from "@/components/admin/auth/AuthLayout";
import { AuthInput, PrimaryButton, OutlineButton } from "@/components/admin/auth/AuthComponents";


const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});
type FormData = z.infer<typeof schema>;

const ForgotPasswordScreen: React.FC = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    console.log("Send reset code to:", data.email);
    router.push("/auth/otp");
  };

  return (
    <AuthLayout bgImage="/assets/images/forgot.png" bgAlt="Forgot password background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Enter your email and we will send you a verification code to get back
          into your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
        <div className="mb-8">
          <AuthInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="flex gap-3">
          <OutlineButton
            type="button"
            onClick={() => router.back()}
            className="flex-1"
          >
            Back
          </OutlineButton>
          <PrimaryButton
            type="submit"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
            className="flex-1"
          >
            Next
          </PrimaryButton>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;