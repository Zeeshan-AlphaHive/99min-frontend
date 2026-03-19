"use client";

import React, { useEffect } from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui';
import { useI18n } from '@/contexts/i18n-context';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
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

  const handleConfirm = () => {
    onConfirm();
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
        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              {/* Outer glowing circle */}
              
              {/* Inner circle with icon */}
              <div className="relative lightGreen rounded-full p-3">
                <div className="w-10 h-10 bg-lightGreen rounded-full flex items-center justify-center">
                ℹ️
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-textBlack text-center mb-3">
            {tr(title)}
          </h2>

          {/* Body Text */}
          <p className="text-textGray text-center mb-6">
            {tr(description)}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={onClose}
              className="border border-gray-200 bg-white text-textBlack hover:bg-gray-50"
            >
              {tr(cancelText)}
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleConfirm}
              className="bg-orange hover:bg-orangeHover"
            >
              {tr(confirmText)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

