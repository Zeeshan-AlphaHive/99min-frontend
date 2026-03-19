"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";
import { UpdateProfilePayload } from "@/utils/api/settings.api";

interface ProfileFormProps {
  defaultValues: { name: string; username: string; bio: string; phone: string; dob: string; };
  saving: boolean;
  onSubmit: (data: UpdateProfilePayload) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ defaultValues, saving, onSubmit }) => {
  const t = useTranslations();
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });
  const handleFormSubmit = (raw: typeof defaultValues) => {
    const payload: UpdateProfilePayload = {};
    if (raw.name.trim()) payload.name = raw.name.trim();
    if (raw.username.trim()) payload.username = raw.username.trim();
    if (raw.bio.trim()) payload.bio = raw.bio.trim();
    if (raw.phone.trim()) payload.phone = raw.phone.trim();
    if (raw.dob) payload.dob = raw.dob;
    onSubmit(payload);
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-6">
      <div>
        <label className="block text-sm font-medium text-textBlack mb-1">{t("profile.fullName")}</label>
        <input {...register("name")} type="text" placeholder={t("profile.fullNamePlaceholder")} className="w-full px-4 py-3 rounded-xl bg-inputBg border border-transparent focus:border-orange focus:outline-none text-textBlack" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-textBlack mb-1">{t("profile.username")}</label>
        <input {...register("username")} type="text" placeholder={t("profile.usernamePlaceholder")} className="w-full px-4 py-3 rounded-xl bg-inputBg border border-transparent focus:border-orange focus:outline-none text-textBlack" />
        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message as string}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-textBlack mb-1">{t("profile.bio")}</label>
        <textarea {...register("bio")} rows={3} placeholder={t("profile.bioPlaceholder")} className="w-full px-4 py-3 rounded-xl bg-inputBg border border-transparent focus:border-orange focus:outline-none text-textBlack resize-none" />
        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message as string}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-textBlack mb-1">{t("profile.phone")}</label>
        <input {...register("phone")} type="tel" placeholder={t("profile.phonePlaceholder")} className="w-full px-4 py-3 rounded-xl bg-inputBg border border-transparent focus:border-orange focus:outline-none text-textBlack" />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-textBlack mb-1">{t("profile.dob")}</label>
        <input {...register("dob")} type="date" className="w-full px-4 py-3 rounded-xl bg-inputBg border border-transparent focus:border-orange focus:outline-none text-textBlack" />
        {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message as string}</p>}
      </div>
      <Button type="submit" variant="primary" size="md" fullWidth disabled={saving}>
        {saving ? t("profile.saving") : t("profile.saveChanges")}
      </Button>
    </form>
  );
};
export default ProfileForm;