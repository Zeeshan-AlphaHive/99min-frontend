"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import SettingsSection from './SettingsSection';
import FAQItem from './FAQItem';
import ContactSupportCard from './ContactSupportCard';
import SuccessModal from '@/components/shared/SuccessModal';
import { Search, MessageCircle, Mail, Check } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';

interface FAQ {
  question: string;
  answer: string;
}

interface HelpCenterPageProps {
  onBack?: () => void;
}

const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ onBack }) => {
  const { tr } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveChatModalOpen, setIsLiveChatModalOpen] = useState(false);

  const faqs: FAQ[] = [
    {
      question: 'How does 99min work?',
      answer: '99min is a platform for ultra-short task ads. Post a task with a budget, and it will be visible to nearby users for 99 minutes. Interested helpers can respond, and you can chat with them directly.',
    },
    {
      question: 'Why do ads expire in 99 minutes?',
      answer: 'The 99-minute expiration creates urgency and ensures tasks are completed quickly. This time limit helps both task posters and helpers act fast, making the platform efficient for time-sensitive tasks.',
    },
    {
      question: 'How do I post a task?',
      answer: 'Go to the Create tab, fill in your task details including title, description, budget, and location. Select a category and post your ad. It will be live for 99 minutes.',
    },
    {
      question: 'How do payments work?',
      answer: 'Payments are handled securely through the platform. When you accept a helper\'s response, the payment is held in escrow until the task is completed. Once confirmed, the helper receives payment.',
    },
    {
      question: 'Can I cancel or edit an ad?',
      answer: 'Yes, you can cancel an ad at any time before someone responds. Once responses are received, you can still cancel but should communicate with responders. Editing is available before the ad receives responses.',
    },
    {
      question: 'What if no one responds to my ad?',
      answer: 'If no one responds within 99 minutes, your ad will expire automatically. You can post a new ad with adjusted details, budget, or location to attract more helpers.',
    },
    {
      question: 'Is my information kept anonymous?',
      answer: 'Your personal information is protected. Only necessary details like location and task description are visible. Full contact information is only shared after you accept a helper\'s response.',
    },
    {
      question: 'How do I report inappropriate content?',
      answer: 'You can report inappropriate content by clicking the report button on any ad or user profile. Our moderation team reviews all reports and takes appropriate action.',
    },
  ];

  const filteredFAQs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLiveChat = () => {
    setIsLiveChatModalOpen(true);
  };

  const handleEmailSupport = () => {
    window.location.href = 'mailto:support@99min.com';
  };

  return (
    <div className="bg-white min-h-screen">
      <PageHeader title="Help Center" onBack={onBack} maxWidth="7xl" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textGray" />
            <input
              type="text"
              placeholder={tr('Search for help...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-inputBg rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-orange focus:bg-white transition-all text-textBlack placeholder:text-textGray"
            />
          </div>
        </div>

        {/* Frequently Asked Questions Section */}
        <SettingsSection title="FREQUENTLY ASKED QUESTIONS">
          <div className="px-4 py-2">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  defaultOpen={index === 0 && searchQuery === ''}
                />
              ))
            ) : (
              <div className="py-8 text-center text-textGray">
                <p>No results found for {searchQuery}</p>
              </div>
            )}
          </div>
        </SettingsSection>

        {/* Contact Support Section */}
        <SettingsSection title="CONTACT SUPPORT">
          <div className="px-4 py-4 space-y-3">
            <ContactSupportCard
              icon={<MessageCircle className="w-6 h-6" />}
              title="Live Chat"
              description="Chat with our support team"
              onClick={handleLiveChat}
            />
            <ContactSupportCard
              icon={<Mail className="w-6 h-6" />}
              title="Email Support"
              description="support@99min.com"
              onClick={handleEmailSupport}
            />
          </div>
        </SettingsSection>
      </div>

      {/* Live Chat Success Modal */}
      <SuccessModal
        isOpen={isLiveChatModalOpen}
        onClose={() => setIsLiveChatModalOpen(false)}
        title="Live Chat Opening Soon..."
        description="Our live chat feature is coming soon. In the meantime, you can reach out via email."
        buttonText="Got it"
        onButtonClick={() => setIsLiveChatModalOpen(false)}
        icon={<Check className="w-10 h-10" strokeWidth={3} />}
      />
    </div>
  );
};

export default HelpCenterPage;

