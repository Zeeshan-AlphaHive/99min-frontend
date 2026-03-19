"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui';
import { useI18n } from '@/contexts/i18n-context';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  contactInitial: string;
  callType: 'video' | 'voice';
}

const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  contactName,
  contactInitial,
  callType,
}) => {
  const { tr } = useI18n();
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const title = callType === 'video' ? 'Video Call' : 'Voice Call';
  const message = callType === 'video' 
    ? 'Video call feature coming soon...' 
    : 'Voice call feature coming soon...';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-textBlack">{tr(title)}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-textBlack" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-orange rounded-full flex items-center justify-center">
              <span className="text-white text-4xl font-bold">{contactInitial.toUpperCase()}</span>
            </div>
          </div>

          {/* Name */}
          <h3 className="text-xl font-bold text-textBlack text-center mb-3">
            {contactName}
          </h3>

          {/* Message */}
          <p className="text-textGray text-center mb-6">{tr(message)}</p>

          {/* Action Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onClose}
            className="bg-orange hover:bg-orangeHover"
          >
            {tr("Got it")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;

