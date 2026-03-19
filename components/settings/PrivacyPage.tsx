"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import PageHeader from "@/components/shared/PageHeader";
import SettingsSection from "./SettingsSection";
import RadioButton from "./RadioButton";
import NotificationToggle from "./NotificationToggle";
import BlockedUsersSection from "./BlockedUsersSection";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { Button } from "@/components/ui";
import { usePrivacySettings } from "@/hooks/UsePrivacySetting";
import { deleteMyAccount } from "@/utils/api/account-action.api";
import { downloadMyData } from "@/utils/api/account-action.api";
import { useI18n } from "@/contexts/i18n-context";

interface PrivacyPageProps {
  onBack?: () => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  const { tr } = useI18n();
  const router = useRouter();
  const { settings, loading, error, handleUpdate } = usePrivacySettings();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDownloadData = async () => {
    try {
      setIsDownloading(true);
      setActionError(null);
      await downloadMyData(); // handles blob + anchor click internally
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to download data");
    } finally {
      setIsDownloading(false);
    }
  };

    const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => router.push("/auth/login"),
    onError: (err) =>
      setActionError(err instanceof Error ? err.message : "Failed to delete account"),
  });

  const handleDeleteAccount = () => deleteAccount();
  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <PageHeader title="Privacy & Safety" onBack={onBack} maxWidth="7xl" />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <PageHeader title="Privacy & Safety" onBack={onBack} maxWidth="7xl" />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {(error || actionError) && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {tr(error || actionError || "")}
          </div>
        )}

        {/* Profile Visibility */}
        <SettingsSection title="PROFILE VISIBILITY">
          <div className="px-4 py-2">
            <RadioButton
              name="profileVisibility"
              value="public"
              label="Public"
              description="Anyone can see your profile"
              checked={settings?.profileVisibility === "public"}
              onChange={() => handleUpdate({ profileVisibility: "public" })}
            />
            <RadioButton
              name="profileVisibility"
              value="private"
              label="Private"
              description="Only people you chat with"
              checked={settings?.profileVisibility === "private"}
              onChange={() => handleUpdate({ profileVisibility: "private" })}
            />
            <RadioButton
              name="profileVisibility"
              value="friends"
              label="Friends Only"
              description="Completely restricted"
              checked={settings?.profileVisibility === "friends"}
              onChange={() => handleUpdate({ profileVisibility: "friends" })}
            />
          </div>
        </SettingsSection>

        {/* Information Sharing */}
        <SettingsSection title="INFORMATION SHARING">
          <div className="px-4">
            <NotificationToggle
              label="Show Location"
              description="Display city/region on ads"
              enabled={settings?.showLocation ?? true}
              onChange={(val) => handleUpdate({ showLocation: val })}
            />
            <NotificationToggle
              label="Show Phone Number"
              description="Share with responders"
              enabled={settings?.showPhone ?? false}
              onChange={(val) => handleUpdate({ showPhone: val })}
            />
            <NotificationToggle
              label="Show Email"
              description="Visible on your profile"
              enabled={settings?.showEmail ?? false}
              onChange={(val) => handleUpdate({ showEmail: val })}
            />
          </div>
        </SettingsSection>

        {/* Who Can Message */}
        <SettingsSection title="WHO CAN MESSAGE YOU">
          <div className="px-4 py-2">
            <RadioButton
              name="whoCanMessage"
              value="true"
              label="Everyone"
              checked={settings?.allowMessages === true}
              onChange={() => handleUpdate({ allowMessages: true })}
            />
            <RadioButton
              name="whoCanMessage"
              value="false"
              label="No One"
              checked={settings?.allowMessages === false}
              onChange={() => handleUpdate({ allowMessages: false })}
            />
          </div>
        </SettingsSection>

        <BlockedUsersSection />

        {/* Data & Privacy */}
        <SettingsSection title="DATA & PRIVACY">
          <div className="px-4 py-4 space-y-4">
            <button
              onClick={handleDownloadData}
              disabled={isDownloading}
              className="w-full px-4 bg-inputBg py-4 rounded-xl text-left text-textBlack font-medium hover:text-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? tr("Preparing download…") : tr("Download My Data")}
            </button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isDeleting}
              className="bg-lightRed text-red text-start hover:bg-red-50 border-0 disabled:opacity-50"
            >
              <span className="text-red">
                {isDeleting ? tr("Deleting…") : tr("Delete My Account")}
              </span>
            </Button>
          </div>
        </SettingsSection>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="This is permanent and cannot be undone. All your data, tasks, and history will be removed immediately."
        confirmText="Delete My Account"
        cancelText="Cancel"
      />
    </div>
  );
};

export default PrivacyPage;