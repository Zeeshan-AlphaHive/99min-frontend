"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SettingsHeader from "@/components/settings/SettingsHeader";
import UserProfileCard from "@/components/settings/UserProfileCard";
import SettingsSection from "@/components/settings/SettingsSection";
import SettingsItem from "@/components/settings/SettingsItem";
import LogOutButton from "@/components/settings/LogOutButton";
import ProfilePage from "@/components/settings/ProfilePage";
import NotificationsPage from "@/components/settings/NotificationsPage";
import LocationPage from "@/components/settings/LocationPage";
import PrivacyPage from "@/components/settings/PrivacyPage";
import HelpCenterPage from "@/components/settings/HelpCenterPage";
import PaymentMethodsPage from "@/components/settings/PaymentMethodsPage";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { useProfile } from "@/hooks/UseProfile";
import { useI18n } from "@/contexts/i18n-context";
import { useAuth } from "@/store/auth-context";
import { setAccessToken } from "@/utils/api";

import { User, Bell, MapPin, CreditCard, Shield, HelpCircle, Lock } from "lucide-react";

const SettingsPage: React.FC = () => {
  const router = useRouter();
  const { profile } = useProfile();
  const { tr } = useI18n();
  const { logout } = useAuth();

  const layoutBackgroundClassName = "bg-inputBg";

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setAccessToken(null);
    router.replace("/auth/login");
  };

 const handleProfileSubmit = () => {
  setShowProfile(false);
};

  if (showProfile) {
    return (
      <DashboardLayout backgroundClassName={layoutBackgroundClassName}>
      <ProfilePage onBack={() => setShowProfile(false)} onSubmit={handleProfileSubmit} />
      </DashboardLayout>
    );
  }

  if (showNotifications) {
    return (
      <DashboardLayout backgroundClassName={layoutBackgroundClassName}>
        <NotificationsPage onBack={() => setShowNotifications(false)} />
      </DashboardLayout>
    );
  }

  if (showLocation) {
    return (
      <DashboardLayout backgroundClassName={layoutBackgroundClassName}>
        <LocationPage onBack={() => setShowLocation(false)} />
      </DashboardLayout>
    );
  }

  if (showPrivacy) {
    return (
      <DashboardLayout backgroundClassName={layoutBackgroundClassName}>
        <PrivacyPage onBack={() => setShowPrivacy(false)} />
      </DashboardLayout>
    );
  }

  if (showHelpCenter) {
    return (
      <DashboardLayout backgroundClassName={layoutBackgroundClassName}>
        <HelpCenterPage onBack={() => setShowHelpCenter(false)} />
      </DashboardLayout>
    );
  }

  if (showPaymentMethods) {
    return (
      <DashboardLayout backgroundClassName={layoutBackgroundClassName}>
        <PaymentMethodsPage onBack={() => setShowPaymentMethods(false)} />
      </DashboardLayout>
    );
  }

  // Derive display values from real profile data
  const displayName = profile?.name ?? "—";
  const displayInitial = profile?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <DashboardLayout backgroundClassName={layoutBackgroundClassName}>
      <div className="min-h-screen bg-inputBg">
        <div className="max-w-4xl bg-white mx-auto px-4">
          <SettingsHeader />

          <UserProfileCard
            name={displayName}
            initial={displayInitial}
            avatar={profile?.avatar}
          />

          {/* ACCOUNT */}
          <SettingsSection title={tr("ACCOUNT")}>
            <div className="px-4">
              <SettingsItem
                icon={<User className="w-5 h-5" />}
                label={tr("Profile")}
                onClick={() => setShowProfile(true)}
              />
            </div>
            <div className="px-4">
              <SettingsItem
                icon={<Bell className="w-5 h-5" />}
                label={tr("Notifications")}
                onClick={() => setShowNotifications(true)}
              />
            </div>
            <div className="px-4">
              <SettingsItem
                icon={<MapPin className="w-5 h-5" />}
                label={tr("Location")}
                onClick={() => setShowLocation(true)}
              />
            </div>
          </SettingsSection>

          {/* BILLING */}
          <SettingsSection title={tr("BILLING")}>
            <div className="px-4">
              <SettingsItem
                icon={<CreditCard className="w-5 h-5" />}
                label={tr("Payment Methods")}
                onClick={() => setShowPaymentMethods(true)}
              />
            </div>
            <div className="px-4">
              <SettingsItem
                icon={<Shield className="w-5 h-5" />}
                label={tr("Subscriptions")}
                href="/dashboard/subscriptions"
              />
            </div>
          </SettingsSection>

          {/* SUPPORT */}
          <SettingsSection title={tr("SUPPORT")}>
            <div className="px-4">
              <SettingsItem
                icon={<HelpCircle className="w-5 h-5" />}
                label={tr("Help Center")}
                onClick={() => setShowHelpCenter(true)}
              />
            </div>
            <div className="px-4">
              <SettingsItem
                icon={<Lock className="w-5 h-5" />}
                label={tr("Privacy & Safety")}
                onClick={() => setShowPrivacy(true)}
              />
            </div>
          </SettingsSection>

          <div className="mb-8">
            <LogOutButton onClick={() => setIsLogoutModalOpen(true)} />
          </div>

          <div className="text-center">
            <p className="text-textGray text-xs">{tr("Version 1.0.0")}</p>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title={tr("Log Out")}
        description={tr("Are you sure you want to log out?")}
        confirmText={tr("Log Out")}
        cancelText={tr("Cancel")}
      />
    </DashboardLayout>
  );
};

export default SettingsPage;