"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import PageHeader from '@/components/shared/PageHeader';
import SettingsSection from './SettingsSection';
import FAQItem from './FAQItem';
import ContactSupportCard from './ContactSupportCard';
import SuccessModal from '@/components/shared/SuccessModal';
import { Search, MessageCircle, Mail, Check } from 'lucide-react';

interface HelpCenterPageProps { onBack?: () => void; }

const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ onBack }) => {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveChatModalOpen, setIsLiveChatModalOpen] = useState(false);

  const faqs = [
    { question: t("help.faq1Q"), answer: t("help.faq1A") },
    { question: t("help.faq2Q"), answer: t("help.faq2A") },
    { question: t("help.faq3Q"), answer: t("help.faq3A") },
    { question: t("help.faq4Q"), answer: t("help.faq4A") },
    { question: t("help.faq5Q"), answer: t("help.faq5A") },
    { question: t("help.faq6Q"), answer: t("help.faq6A") },
    { question: t("help.faq7Q"), answer: t("help.faq7A") },
    { question: t("help.faq8Q"), answer: t("help.faq8A") },
  ];

  const filteredFAQs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      <PageHeader title={t("help.title")} onBack={onBack} maxWidth="7xl" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textGray" />
            <input type="text" placeholder={t("help.searchPlaceholder")} value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-inputBg rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-orange focus:bg-white transition-all text-textBlack placeholder:text-textGray" />
          </div>
        </div>
        <SettingsSection title={t("help.faqTitle")}>
          <div className="px-4 py-2">
            {filteredFAQs.length > 0
              ? filteredFAQs.map((faq, index) => <FAQItem key={index} question={faq.question} answer={faq.answer} defaultOpen={index === 0 && searchQuery === ''} />)
              : <div className="py-8 text-center text-textGray"><p>{t("help.noResults")} {searchQuery}</p></div>}
          </div>
        </SettingsSection>
        <SettingsSection title={t("help.contactTitle")}>
          <div className="px-4 py-4 space-y-3">
            <ContactSupportCard icon={<MessageCircle className="w-6 h-6" />} title={t("help.liveChat")} description={t("help.liveChatDesc")} onClick={() => setIsLiveChatModalOpen(true)} />
            <ContactSupportCard icon={<Mail className="w-6 h-6" />} title={t("help.emailSupport")} description={t("help.emailSupportDesc")} onClick={() => { window.location.href = 'mailto:support@99min.com'; }} />
          </div>
        </SettingsSection>
      </div>
      <SuccessModal isOpen={isLiveChatModalOpen} onClose={() => setIsLiveChatModalOpen(false)}
        title={t("help.liveChatComingSoon")} description={<>{t("help.liveChatComingSoonDesc")}</>}
        buttonText={t("common.gotIt")} onButtonClick={() => setIsLiveChatModalOpen(false)}
        icon={<Check className="w-10 h-10" strokeWidth={3} />} />
    </div>
  );
};

export default HelpCenterPage;