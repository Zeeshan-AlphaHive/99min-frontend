"use client";

import React from 'react';
import ReportModal from '@/components/shared/ReportModal';

interface ReportAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (reason: string, details: string) => void;
}

function normalizeAdReportReason(reason: string): string {
  const map: Record<string, string> = {
    "Spam or misleading": "spam",
    "Inappropriate content": "inappropriate",
    "Scam or fraud": "scam",
    "Duplicate posting": "duplicate",
    "Violates terms of service": "other",
    Other: "other",
  };

  if (map[reason]) return map[reason];
  const r = reason.trim().toLowerCase();
  if (["spam", "inappropriate", "scam", "duplicate", "other"].includes(r)) return r;
  return "other";
}

const ReportAdModal: React.FC<ReportAdModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  return (
    <ReportModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={(reason, details) => onSubmit?.(normalizeAdReportReason(reason), details)}
      type="ad"
    />
  );
};

export default ReportAdModal;

