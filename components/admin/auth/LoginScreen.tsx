"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthLayout } from "@/components/admin/auth/AuthLayout";
import { AuthInput, PrimaryButton } from "@/components/admin/auth/AuthComponents";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    console.log("Login:", data, "Remember:", rememberMe);
    router.push("/dashboard");
  };

  return (
    <AuthLayout bgImage="/assets/images/login.png" bgAlt="Login background">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
          Log in
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Welcome back! Please enter your details.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
        {/* Email */}
        <AuthInput
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password */}
        <AuthInput
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between mb-6 mt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-orange-500 cursor-pointer"
            />
            <span className="text-sm text-gray-500">Remember for 30 days</span>
          </label>

          <Link
            href="/auth/forgot-password"
            className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
          >
            Forgot password
          </Link>
        </div>

        {/* Submit */}
        <PrimaryButton
          type="submit"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Log in"}
        </PrimaryButton>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-semibold text-orange-500 hover:text-orange-600 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginScreen;