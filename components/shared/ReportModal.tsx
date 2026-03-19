"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';
import { useI18n } from '@/contexts/i18n-context';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (reason: string, details: string) => void;
  type: 'ad' | 'user';
  userName?: string;
}

const adReasons = [
  'Spam or misleading',
  'Inappropriate content',
  'Scam or fraud',
  'Duplicate posting',
  'Violates terms of service',
  'Other',
];

const userReasons = [
  'Spam or scam',
  'Inappropriate behavior',
  'Harassment',
  'Fake profile',
  'Other',
];

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  userName,
}) => {
  const { tr } = useI18n();
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  const reasons = type === 'ad' ? adReasons : userReasons;
  const title = type === 'ad' ? 'Report Ad' : 'Report User';
  const submitButtonText = type === 'ad' ? 'Report Ad' : 'Submit Report';
  const questionText = type === 'ad' 
    ? "What's wrong with this ad?"
    : 'Reason for reporting *';
  const detailsLabel = type === 'ad' 
    ? 'Tell us more (optional)'
    : 'Additional details (optional)';
  const detailsPlaceholder = type === 'ad'
    ? 'Share specific details about the issue...'
    : 'Provide more context...';
  const bannerText = type === 'ad'
    ? 'Protect our community. Reports are anonymous and help us maintain a safe marketplace.'
    : `Help us keep the community safe. Report ${userName || 'this user'} if they've violated our community guidelines.`;

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

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setSelectedReason('');
      setDetails('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (selectedReason && onSubmit) {
      onSubmit(selectedReason, details);
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
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red" />
            <h2 className="text-xl font-bold text-textBlack">{tr(title)}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-textBlack" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Informational Banner */}
          <div className="bg-lightRed border border-red rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-darkRed shrink-0 mt-0.5" />
            <p className="text-sm text-darkRed leading-relaxed">
              {tr(bannerText)}
            </p>
          </div>

          {/* Reason Selection */}
          <div className="mb-6">
            <h3 className="text-textBlack font-bold text-base mb-4">
              {tr(questionText)}
            </h3>
            <div className={`grid ${type === 'ad' ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
              {reasons.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left
                      ${
                        isSelected
                          ? 'bg-lightRed border-2 border-red text-darkRed'
                          : 'bg-white border border-gray-200 text-textBlack hover:bg-gray-50'
                      }`}
                  >
                    {tr(reason)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Details */}
          <div className="mb-6">
            <h3 className="text-textBlack font-bold text-base mb-3">
              {tr(detailsLabel)}
            </h3>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={tr(detailsPlaceholder)}
              className="w-full h-32 px-4 py-3 bg-inputBg rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-orange focus:bg-white transition-all text-textBlack placeholder:text-textGray resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={onClose}
            className="border border-gray-200"
          >
            {tr("Cancel")}
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleSubmit}
            disabled={!selectedReason}
            className="bg-red hover:bg-red disabled:bg-lightGrey disabled:cursor-not-allowed"
          >
            {tr(submitButtonText)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;

