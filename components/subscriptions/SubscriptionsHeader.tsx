"use client";

import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import { useI18n } from "@/contexts/i18n-context";

const SubscriptionsHeader: React.FC = () => {
  const { tr } = useI18n();
  return <PageHeader title={tr("Subscriptions")} maxWidth="7xl" />;
};

export default SubscriptionsHeader;

