"use client";

import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import SettingsSection from "./SettingsSection";
import NotificationToggle from "./NotificationToggle";
import { useNotificationSettings } from "@/hooks/UseNotificationSetting";
import { useI18n } from "@/contexts/i18n-context";

interface NotificationsPageProps {
  onBack?: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack }) => {
  const { tr } = useI18n();
  const { settings, loading, error, handleToggle } = useNotificationSettings();

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <PageHeader title="Notifications" onBack={onBack} maxWidth="7xl" />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <PageHeader title="Notifications" onBack={onBack} maxWidth="7xl" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{tr(error)}</div>
        )}

        {/* REMOVED: saving banner — toggles are optimistic, no banner needed */}

        <SettingsSection title="NOTIFICATION CHANNELS">
          <div className="px-4">
            <NotificationToggle
              label="Push Notifications"
              description="Receive alerts on your device"
              enabled={settings?.push ?? false}
              onChange={(val) => handleToggle("push", val)}
            />
            <NotificationToggle
              label="Email"
              description="Get updates via email"
              enabled={settings?.email ?? false}
              onChange={(val) => handleToggle("email", val)}
            />
            <NotificationToggle
              label="SMS"
              description="Receive text messages"
              enabled={settings?.sms ?? false}
              onChange={(val) => handleToggle("sms", val)}
            />
          </div>
        </SettingsSection>

        <SettingsSection title="NOTIFICATION TYPES">
          <div className="px-4">
            <NotificationToggle
              label="New Responses"
              description="When someone responds to your ad"
              enabled={settings?.newResponse ?? false}
              onChange={(val) => handleToggle("newResponse", val)}
            />
            <NotificationToggle
              label="Task Expiring"
              description="15 minutes before ad expires"
              enabled={settings?.taskExpiring ?? false}
              onChange={(val) => handleToggle("taskExpiring", val)}
            />
            <NotificationToggle
              label="Task Accepted"
              description="When your response is accepted"
              enabled={settings?.taskAccepted ?? false}
              onChange={(val) => handleToggle("taskAccepted", val)}
            />
            <NotificationToggle
              label="Weekly Digest"
              description="Weekly summary of your activity"
              enabled={settings?.weeklyDigest ?? false}
              onChange={(val) => handleToggle("weeklyDigest", val)}
            />
            <NotificationToggle
              label="Marketing"
              description="Tips, offers, and promotions"
              enabled={settings?.marketing ?? false}
              onChange={(val) => handleToggle("marketing", val)}
            />
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

export default NotificationsPage;