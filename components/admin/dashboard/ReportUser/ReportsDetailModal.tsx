'use client';

import React from 'react';
import { X } from 'lucide-react';
import type { AdminTaskReport } from '@/utils/api/admin.reports.api';
import { removeTask } from '@/utils/api/admin.moderation.api';

type ReportDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onBanUser: () => void;
  report: AdminTaskReport | null;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-textGray mb-3">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="border-t border-gray-100" />;
}

export default function ReportDetailsModal({
  isOpen,
  onClose,
  onBanUser,
  report,
}: ReportDetailsModalProps) {
  if (!isOpen) return null;

  const taskTitle = report?.taskId?.title || 'Unknown task';
  const reporterName = report?.reporterUserId?.name || 'Unknown';
  const reporterEmail = report?.reporterUserId?.email || '';
  const reason = report?.reason || '—';
  const details = report?.details?.trim() ? report.details : 'No additional details provided.';
  const status = report?.status || 'pending';
  const createdAt = report?.createdAt ? new Date(report.createdAt).toLocaleString() : '—';
  const updatedAt = report?.updatedAt ? new Date(report.updatedAt).toLocaleString() : '—';
  const taskId = report?.taskId?._id || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 mt-2 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-semibold text-textBlack">Report Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-textGray" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Report summary */}
          <div className="mt-3">
            <SectionLabel>Reported Task</SectionLabel>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
              <p className="text-sm font-semibold text-textBlack">{taskTitle}</p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-textGray">Status</p>
                  <p className="text-sm font-medium text-textBlack">{status}</p>
                </div>
                <div>
                  <p className="text-xs text-textGray">Reason</p>
                  <p className="text-sm font-medium text-textBlack">{reason}</p>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* Complaint */}
          <div className="mt-3">
            <SectionLabel>Complaint</SectionLabel>
            <p className="text-sm text-textGray bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 leading-relaxed">
              {details}
            </p>
            <p className="text-xs text-textGray mt-3">
              Reported by:{' '}
              <span className="font-semibold text-textBlack">
                {reporterName}{reporterEmail ? ` (${reporterEmail})` : ''}
              </span>
            </p>
          </div>

          <Divider />

          {/* Metadata */}
          <div className="mt-3">
            <SectionLabel>Metadata</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <p className="text-xs text-textGray">Created</p>
                <p className="text-sm font-medium text-textBlack">{createdAt}</p>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <p className="text-xs text-textGray">Last updated</p>
                <p className="text-sm font-medium text-textBlack">{updatedAt}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="sm:flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-textBlack hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!taskId) return;
              await removeTask(taskId, { reason: "Removed due to report" });
              onClose();
            }}
            className="sm:flex-1 py-2.5 bg-orange hover:opacity-90 rounded-xl text-sm font-medium text-white transition-colors"
          >
            Remove Task
          </button>
          <button
            type="button"
            onClick={onBanUser}
            className="sm:flex-1 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-medium text-white transition-colors"
          >
            Ban User
          </button>
          </div>
        </div>

      </div>
    </div>
  );
}