"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import PageHeader from "@/components/shared/PageHeader";
import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import { useProfile } from "@/hooks/UseProfile";
import { profileQueryKey } from "@/hooks/UseProfile";
import { UpdateProfilePayload, uploadAvatar, deleteAvatar  } from "@/utils/api/settings.api";
import { useI18n } from "@/contexts/i18n-context";

interface ProfilePageProps {
  onBack?: () => void;
  onSubmit?: (data: UpdateProfilePayload) => void;
}

function formatDobForInput(dob: string | Date | undefined | null): string {
  if (!dob) return "";
  const date = new Date(dob);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, onSubmit }) => {
  const { tr } = useI18n();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { profile, loading, saving, error, handleUpdateProfile } = useProfile();

  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  const handleImageChange = async (file: File) => {
    // Show instant local preview
    const previewUrl = URL.createObjectURL(file);
    setLocalAvatarUrl(previewUrl);
    setAvatarError(null);

    try {
      setAvatarUploading(true);
      await uploadAvatar(file);
      await queryClient.invalidateQueries({ queryKey: profileQueryKey });
      URL.revokeObjectURL(previewUrl);
      setLocalAvatarUrl(null); // now use real Cloudinary URL from refreshed cache
    } catch (err) {
      setLocalAvatarUrl(null);
      setAvatarError(
        err instanceof Error ? err.message : "Failed to upload avatar"
      );
      URL.revokeObjectURL(previewUrl);
    } finally {
      setAvatarUploading(false);
    }
  };
const handleDeleteAvatar = async () => {
  try {
    setAvatarUploading(true);
    setAvatarError(null);
    await deleteAvatar();
    await queryClient.invalidateQueries({ queryKey: profileQueryKey });
    setLocalAvatarUrl(null);
  } catch (err) {
    setAvatarError(err instanceof Error ? err.message : "Failed to remove avatar");
  } finally {
    setAvatarUploading(false);
  }
};
  const handleSubmit = async (data: UpdateProfilePayload) => {
    const success = await handleUpdateProfile(data);
    if (success && onSubmit) onSubmit(data);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <PageHeader title="Profile" onBack={handleBack} maxWidth="7xl" />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 animate-pulse mx-auto" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <PageHeader title="Profile" onBack={handleBack} maxWidth="7xl" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {(error || avatarError) && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {tr(error || avatarError || "")}
          </div>
        )}

        <ProfileAvatar
          initial={profile?.name?.[0]?.toUpperCase() ?? "?"}
          imageUrl={localAvatarUrl ?? profile?.avatar}
          onImageChange={handleImageChange}
          uploading={avatarUploading}
           onImageDelete={handleDeleteAvatar}
        />

        <ProfileForm
          defaultValues={{
            name: profile?.name ?? "",
            username: profile?.username ?? "",
            bio: profile?.bio ?? "",
            phone: profile?.phone ?? "",
            dob: formatDobForInput(profile?.dob),
          }}
          saving={saving}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ProfilePage;