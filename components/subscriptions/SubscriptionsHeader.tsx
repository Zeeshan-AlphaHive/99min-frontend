"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import PageHeader from '@/components/shared/PageHeader';

const SubscriptionsHeader: React.FC = () => {
  const t = useTranslations();
  return <PageHeader title={t("subscriptions.choosePlanHeader")} maxWidth="7xl" />;
};

export default SubscriptionsHeader;