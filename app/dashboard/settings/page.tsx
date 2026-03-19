"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
import { User, Bell, MapPin, CreditCard, Shield, HelpCircle, Lock } from "lucide-react";

const SettingsPage: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();
  const { profile } = useProfile();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const handleLogout = () => router.push("/auth/login");
  const handleProfileSubmit = () => setShowProfile(false);

  if (showProfile) return <DashboardLayout><ProfilePage onBack={() => setShowProfile(false)} onSubmit={handleProfileSubmit} /></DashboardLayout>;
  if (showNotifications) return <DashboardLayout><NotificationsPage onBack={() => setShowNotifications(false)} /></DashboardLayout>;
  if (showLocation) return <DashboardLayout><LocationPage onBack={() => setShowLocation(false)} /></DashboardLayout>;
  if (showPrivacy) return <DashboardLayout><PrivacyPage onBack={() => setShowPrivacy(false)} /></DashboardLayout>;
  if (showHelpCenter) return <DashboardLayout><HelpCenterPage onBack={() => setShowHelpCenter(false)} /></DashboardLayout>;
  if (showPaymentMethods) return <DashboardLayout><PaymentMethodsPage onBack={() => setShowPaymentMethods(false)} /></DashboardLayout>;

  const displayName = profile?.name ?? "—";
  const displayInitial = profile?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-inputBg">
        <div className="max-w-4xl bg-white mx-auto px-4">
          <SettingsHeader />
          <UserProfileCard name={displayName} initial={displayInitial} avatar={profile?.avatar} />
          <SettingsSection title={t("settings.account")}>
            <div className="px-4"><SettingsItem icon={<User className="w-5 h-5" />} label={t("settings.profile")} onClick={() => setShowProfile(true)} /></div>
            <div className="px-4"><SettingsItem icon={<Bell className="w-5 h-5" />} label={t("settings.notifications")} onClick={() => setShowNotifications(true)} /></div>
            <div className="px-4"><SettingsItem icon={<MapPin className="w-5 h-5" />} label={t("settings.location")} onClick={() => setShowLocation(true)} /></div>
          </SettingsSection>
          <SettingsSection title={t("settings.billing")}>
            <div className="px-4"><SettingsItem icon={<CreditCard className="w-5 h-5" />} label={t("settings.paymentMethods")} onClick={() => setShowPaymentMethods(true)} /></div>
            <div className="px-4"><SettingsItem icon={<Shield className="w-5 h-5" />} label={t("settings.subscriptions")} href="/dashboard/subscriptions" /></div>
          </SettingsSection>
          <SettingsSection title={t("settings.support")}>
            <div className="px-4"><SettingsItem icon={<HelpCircle className="w-5 h-5" />} label={t("settings.helpCenter")} onClick={() => setShowHelpCenter(true)} /></div>
            <div className="px-4"><SettingsItem icon={<Lock className="w-5 h-5" />} label={t("settings.privacy")} onClick={() => setShowPrivacy(true)} /></div>
          </SettingsSection>
          <div className="mb-8"><LogOutButton onClick={() => setIsLogoutModalOpen(true)} /></div>
          <div className="text-center"><p className="text-textGray text-xs">{t("settings.version")}</p></div>
        </div>
      </div>
      <ConfirmationModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleLogout}
        title={t("settings.logoutTitle")} description={t("settings.logoutDesc")}
        confirmText={t("settings.logout")} cancelText={t("common.cancel")} />
    </DashboardLayout>
  );
};
export default SettingsPage;