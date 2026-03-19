"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';

interface ShareAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare?: (platform: string) => void;
}

const shareOptions = [
  { id: 'whatsapp', label: 'WhatsApp', icon:"📱" ,className: 'bg-[#25D36615]' },
  { id: 'facebook', label: 'Facebook', icon: '👤', className: 'bg-[#1877F215]' },
  { id: 'twitter', label: 'Twitter', icon: '🐦', className: 'bg-[#1877F215]' },
  { id: 'email', label: 'Email', icon: '✉️', className: 'bg-[#1877F215]' },
    { id: 'copylink', label: 'Copy Link', icon: '🔗', className: 'bg-[#FF7A0015]' },
  { id: 'messenger', label: 'Messenger', icon: '💬', className: 'bg-[#1877F215]' },
  { id: 'telegram', label: 'Telegram', icon: '✈️', className: 'bg-[#1877F215]' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', className: 'bg-[#1877F215]' },
];

const ShareAdModal: React.FC<ShareAdModalProps> = ({
  isOpen,
  onClose,
  onShare,
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

  const handleShare = (platform: string) => {
    if (onShare) {
      onShare(platform);
    }
    
    // Handle copy link separately
    if (platform === 'copylink') {
      navigator.clipboard.writeText(window.location.href);
    }
    
    onClose();
  };

  if (!isOpen) return null;

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
          <h2 className="text-xl font-bold text-textBlack">{tr("Share Ad")}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-textBlack" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Sharing Options Grid */}
          <div className="grid grid-cols-4 gap-4">
            {shareOptions.map((option) => {
              return (
                <button
                  key={option.id}
                  onClick={() => handleShare(option.id)}
                  className={`flex flex-col  ${option.className} items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors`}
                >
                  <div className={`text-2xl font-bold`}>{option.icon}</div>
                  <span className="text-xs font-medium text-textBlack text-center">
                    {tr(option.label)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareAdModal;

