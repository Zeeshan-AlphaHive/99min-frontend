"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui";
import { UpdateProfilePayload } from "@/utils/api/settings.api";
import { useI18n } from "@/contexts/i18n-context";

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

const ProfileForm: React.FC<ProfileFormProps> = ({ defaultValues, saving, onSubmit }) => {
  const { tr } = useI18n();
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  const handleFormSubmit = (raw: typeof defaultValues) => {
    // FIX: strip empty strings before sending to the backend.
    // The validator uses isMobilePhone / isISO8601 which both reject "" as invalid.
    // Only include a field if the user actually entered a value.
    const payload: UpdateProfilePayload = {};
    if (raw.name.trim())     payload.name     = raw.name.trim();
    if (raw.username.trim()) payload.username  = raw.username.trim();
    if (raw.bio.trim())      payload.bio       = raw.bio.trim();
    if (raw.phone.trim())    payload.phone     = raw.phone.trim();
    if (raw.dob)             payload.dob       = raw.dob;

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-6">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-textBlack mb-1">{tr("Full Name")}</label>
        <input
          {...register("name")}
          type="text"
          placeholder={tr("Enter your full name")}
          className="w-full px-4 py-3 rounded-xl bg-inputBg border border-transparent focus:border-orange focus:outline-none text-textBlack"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{tr(String(errors.name.message))}</p>}
      </div>

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-textBlack mb-1">{tr("Username")}</label>
        <input
          {...register("username")}
          type="text"
          placeholder={tr("e.g. john_doe")}
          className="w-full px-4 py-3 rounded-xl bg-inputBg border border-transparent focus:border-orange focus:outline-none text-textBlack"
        />
        {errors.username && <p className="text-red-500 text-xs mt-1">{tr(String(errors.username.message))}</p>}
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-textBlack mb-1">{tr("Bio")}</label>
        <textarea
          {...register("bio")}
          rows={3}
          placeholder={tr("Tell us about yourself")}
          className="w-full px-4 py-3 rounded-xl bg-inputBg border border-transparent focus:border-orange focus:outline-none text-textBlack resize-none"
        />
        {errors.bio && <p className="text-red-500 text-xs mt-1">{tr(String(errors.bio.message))}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-textBlack mb-1">{tr("Phone")}</label>
        <input
          {...register("phone")}
          type="tel"
          placeholder={tr("+1 234 567 8900")}
          className="w-full px-4 py-3 rounded-xl bg-inputBg border border-transparent focus:border-orange focus:outline-none text-textBlack"
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{tr(String(errors.phone.message))}</p>}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium text-textBlack mb-1">{tr("Date of Birth")}</label>
        <input
          {...register("dob")}
          type="date"
          className="w-full px-4 py-3 rounded-xl bg-inputBg border border-transparent focus:border-orange focus:outline-none text-textBlack"
        />
        {errors.dob && <p className="text-red-500 text-xs mt-1">{tr(String(errors.dob.message))}</p>}
      </div>

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