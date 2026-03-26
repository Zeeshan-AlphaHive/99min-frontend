"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthLayout } from "@/components/admin/auth/AuthLayout";
import { AuthInput, PrimaryButton } from "@/components/admin/auth/AuthComponents";


const schema = z
  .object({
    newPassword: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const NewPasswordScreen: React.FC = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const newPassword = watch("newPassword") ?? "";

  const strength = [
    newPassword.length >= 8,
    /[A-Z]/.test(newPassword),
    /[0-9]/.test(newPassword),
    /[^A-Za-z0-9]/.test(newPassword),
  ].filter(Boolean).length;

  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthBarColors = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];
  const strengthTextColors = ["", "text-red-500", "text-yellow-500", "text-blue-500", "text-green-500"];

  const onSubmit = async (data: FormData) => {
    console.log("Set new password:", data.newPassword);
    router.push("/auth/password-updated");
  };

  return (
    <AuthLayout bgImage="/assets/images/new.png" bgAlt="Create new password background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
          Create New Password
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Create a secure new password to protect your account and keep your
          information safe always.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
        <AuthInput
          label="New Password"
          type="password"
          placeholder="Enter new password"
          hint="Must be at least 8 characters."
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />

        {newPassword.length > 0 && (
          <div className="mb-4 -mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength ? strengthBarColors[strength] : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            {strengthLabels[strength] && (
              <p className="text-xs text-gray-400">
                Strength:{" "}
                <span className={`font-medium ${strengthTextColors[strength]}`}>
                  {strengthLabels[strength]}
                </span>
              </p>
            )}
          </div>
        )}

        <AuthInput
          label="Confirm New Passwords"
          type="password"
          placeholder="Confirm new password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <div className="mt-2">
          <PrimaryButton
            type="submit"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
          >
            Set New Password
          </PrimaryButton>
        </div>
      </form>
    </AuthLayout>
  );
};

export default NewPasswordScreen;