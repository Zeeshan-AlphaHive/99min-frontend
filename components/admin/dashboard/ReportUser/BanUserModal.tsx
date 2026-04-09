'use client';

import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { banUser } from '@/utils/api/admin.moderation.api';
import { updateTaskReport } from '@/utils/api/admin.reports.api';

type BanUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userId: string | null;
  reportId: string | null;
  onSuccess?: () => void;
};

const BAN_REASONS = [
  'Fraud',
  'Abuse',
  'Spam',
  'Harassment',
  'Fake account',
  'Other',
];

export default function BanUserModal({ isOpen, onClose, userName, userId, reportId, onSuccess }: BanUserModalProps) {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleBan = async () => {
    if (!confirmed || !reason || submitting) return;
    if (!userId) return;
    try {
      setSubmitting(true);
      await banUser(userId, { reason, notes });
      if (reportId) {
        await updateTaskReport(reportId, {
          status: "resolved",
          actionTaken: "banned",
          resolutionNote: notes || reason,
        });
      }
      onSuccess?.();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-textBlack text-center mb-1">
          Permanently Ban User
        </h2>
        <p className="text-sm text-textGray text-center mb-6">
          This action will permanently block{' '}
          <span className="font-semibold text-textBlack">{userName || 'this user'}</span> from the platform. They will
          not be able to log in again.
        </p>

        {/* Reason dropdown */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-textGray uppercase tracking-wide mb-1.5">
            Reason for Ban
          </label>
          <div className="relative">
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full appearance-none px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-textBlack bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
            >
              <option value="" disabled>
                Select a reason…
              </option>
              {BAN_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-textGray">
              ▾
            </span>
          </div>
          {!userId && (
            <p className="text-xs text-red-500 mt-2">
              Unable to ban: missing user id.
            </p>
          )}
        </div>

        {/* Additional notes */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-textGray uppercase tracking-wide mb-1.5">
            Additional Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Provide details for the audit log..."
            rows={4}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-textBlack placeholder:text-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-300 transition resize-none"
          />
        </div>

        {/* Confirmation checkbox */}
        <label className="flex items-start gap-2.5 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-red-500 cursor-pointer"
          />
          <span className="text-sm text-textGray">
            I understand this action is permanent and cannot be undone.
          </span>
        </label>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-textBlack hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleBan}
            disabled={!confirmed || !reason || submitting || !userId}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-medium text-white transition-colors"
          >
            {submitting ? 'Banning...' : 'Ban User'}
          </button>
        </div>
      </div>
    </div>
  );
}