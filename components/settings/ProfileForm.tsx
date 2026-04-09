"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui";
import { UpdateProfilePayload } from "@/utils/api/settings.api";
import { useI18n } from "@/contexts/i18n-context";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ProfileFormProps {
  defaultValues: {
    name: string;
    username: string;
    bio: string;
    phone: string;
    dob: string;
  };
  saving: boolean;
  onSubmit: (data: UpdateProfilePayload) => void;
}

/* ─── Zod Schema ───────────────────────────────────────────── */

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[A-Za-z\s]+$/.test(val), {
      message: "Only letters allowed",
    }),

  username: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[A-Za-z\s]+$/.test(val), {
      message: "Username can only contain letters",
    }),

  bio: z
    .string()
    .trim()
    .max(300, "Bio cannot exceed 300 characters")
    .optional()
    .refine((val) => !val || /^[A-Za-z\s.,!?'-]+$/.test(val), {
      message: "Bio can only contain text (no numbers)",
    }),

  phone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[0-9+()\\-\\s]+$/.test(val), {
      message: "Invalid phone number",
    }),

  dob: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return new Date(val) < new Date();
    }, {
      message: "Date cannot be in the future",
    }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

/* ─── Component ───────────────────────────────────────────── */

const ProfileForm: React.FC<ProfileFormProps> = ({
  defaultValues,
  saving,
  onSubmit,
}) => {
  const { tr } = useI18n();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues,
    resolver: zodResolver(profileSchema),
    mode: "onBlur", // change to "onChange" if you want real-time validation
  });

  const handleFormSubmit = (raw: ProfileFormValues) => {
    const payload: UpdateProfilePayload = {};

    if (raw.name?.trim())     payload.name     = raw.name.trim();
    if (raw.username?.trim()) payload.username = raw.username.trim();
    if (raw.bio?.trim())      payload.bio      = raw.bio.trim();
    if (raw.phone?.trim())    payload.phone    = raw.phone.trim();
    if (raw.dob)              payload.dob      = raw.dob;

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-6">

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-textBlack mb-1">
          {tr("Full Name")}
        </label>
        <input
          {...register("name")}
          type="text"
          placeholder={tr("Enter your full name")}
          className={`w-full px-4 py-3 rounded-xl bg-inputBg border ${
            errors.name ? "border-red-500" : "border-transparent"
          } focus:border-orange focus:outline-none text-textBlack`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">
            {tr(errors.name.message!)}
          </p>
        )}
      </div>

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-textBlack mb-1">
          {tr("Username")}
        </label>
        <input
          {...register("username")}
          type="text"
          placeholder={tr("e.g. john_doe")}
          className={`w-full px-4 py-3 rounded-xl bg-inputBg border ${
            errors.username ? "border-red-500" : "border-transparent"
          } focus:border-orange focus:outline-none text-textBlack`}
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">
            {tr(errors.username.message!)}
          </p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-textBlack mb-1">
          {tr("Bio")}
        </label>
        <textarea
          {...register("bio")}
          rows={3}
          placeholder={tr("Tell us about yourself")}
          className={`w-full px-4 py-3 rounded-xl bg-inputBg border ${
            errors.bio ? "border-red-500" : "border-transparent"
          } focus:border-orange focus:outline-none text-textBlack resize-none`}
        />
        {errors.bio && (
          <p className="text-red-500 text-xs mt-1">
            {tr(errors.bio.message!)}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-textBlack mb-1">
          {tr("Phone")}
        </label>
        <input
          {...register("phone", {
            onChange: (e) => {
              const raw = String(e.target.value ?? "");
              // Allow digits, spaces, +, (), and hyphen; strip letters immediately.
              const sanitized = raw.replace(/[^0-9+()\\-\\s]/g, "");
              setValue("phone", sanitized, { shouldDirty: true, shouldValidate: true });
            },
          })}
          type="tel"
          inputMode="tel"
          placeholder={tr("+1 234 567 8900")}
          className={`w-full px-4 py-3 rounded-xl bg-inputBg border ${
            errors.phone ? "border-red-500" : "border-transparent"
          } focus:border-orange focus:outline-none text-textBlack`}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">
            {tr(errors.phone.message!)}
          </p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium text-textBlack mb-1">
          {tr("Date of Birth")}
        </label>
        <input
          {...register("dob")}
          type="date"
          className={`w-full px-4 py-3 rounded-xl bg-inputBg border ${
            errors.dob ? "border-red-500" : "border-transparent"
          } focus:border-orange focus:outline-none text-textBlack`}
        />
        {errors.dob && (
          <p className="text-red-500 text-xs mt-1">
            {tr(errors.dob.message!)}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        disabled={saving}
      >
        {saving ? tr("Saving…") : tr("Save Changes")}
      </Button>
    </form>
  );
};

export default ProfileForm;