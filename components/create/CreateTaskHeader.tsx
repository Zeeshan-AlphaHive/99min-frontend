"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import PageHeader from '@/components/shared/PageHeader';

const CreateTaskHeader: React.FC = () => {
  const t = useTranslations();
  return <PageHeader title={t("task.createHeader")} />;
};

export default CreateTaskHeader;