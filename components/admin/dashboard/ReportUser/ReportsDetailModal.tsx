'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { AdminTaskReport } from '@/utils/api/admin.reports.api';
import { removeTask } from '@/utils/api/admin.moderation.api';
import { getTaskReport, updateTaskReport } from '@/utils/api/admin.reports.api';

type ReportDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onBanUser: () => void;
  report: AdminTaskReport | null;
  onSuccess?: () => void;
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
  onSuccess,
}: ReportDetailsModalProps) {
  const [freshReport, setFreshReport] = useState<AdminTaskReport | null>(report);
  const reportId = report?._id || null;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isOpen) return;
      if (!reportId) return;
      try {
        const res = await getTaskReport(reportId);
        if (!cancelled) setFreshReport(res.data);
      } catch {
        // keep existing snapshot
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, reportId]);

  // Keep snapshot in sync when opening a different report
  useEffect(() => {
    if (!isOpen) return;
    setFreshReport(report);
  }, [isOpen, reportId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const r = freshReport;
  const taskTitle = r?.taskId?.title || 'Unknown task';
  const reporterName = r?.reporterUserId?.name || 'Unknown';
  const reporterEmail = r?.reporterUserId?.email || '';
  const reason = r?.reason || '—';
  const details = r?.details?.trim() ? r.details : 'No additional details provided.';
  const status = r?.status || 'pending';
  const actionTaken = r?.actionTaken || "none";
  const createdAt = r?.createdAt ? new Date(r.createdAt).toLocaleString() : '—';
  const updatedAt = r?.updatedAt ? new Date(r.updatedAt).toLocaleString() : '—';
  const taskId = r?.taskId?._id || null;
  const ownerStatus = r?.taskId?.posterUserId?.status || "unknown";
  const taskStatus = r?.taskId?.status || "unknown";
  const banDisabled = ownerStatus === "banned" || status === "resolved" || actionTaken === "banned";
  const removeDisabled = taskStatus === "removed" || status === "resolved" || actionTaken === "task_removed";
  const canResolve = status !== "resolved" && !!r?._id;
  const suggestedAction =
    ownerStatus === "banned"
      ? "banned"
      : taskStatus === "removed"
        ? "task_removed"
        : actionTaken !== "none"
          ? actionTaken
          : "none";

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

          {/* Outcome / moderation */}
          <div className="mt-3">
            <SectionLabel>Outcome</SectionLabel>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-textGray">Report status</p>
                  <p className="text-sm font-medium text-textBlack">{status}</p>
                </div>
                <div>
                  <p className="text-xs text-textGray">Action taken</p>
                  <p className="text-sm font-medium text-textBlack">{actionTaken}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <p className="text-xs text-textGray">User status</p>
                  <p className="text-sm font-medium text-textBlack">{ownerStatus}</p>
                </div>
                <div>
                  <p className="text-xs text-textGray">Task status</p>
                  <p className="text-sm font-medium text-textBlack">{taskStatus}</p>
                </div>
              </div>
            </div>
            {canResolve && suggestedAction !== "none" && (
              <button
                type="button"
                onClick={async () => {
                  if (!r?._id) return;
                  await updateTaskReport(r._id, {
                    status: "resolved",
                    actionTaken: suggestedAction,
                    resolutionNote: `Auto-resolved (detected ${suggestedAction})`,
                  });
                  onSuccess?.();
                  onClose();
                }}
                className="mt-3 w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-textBlack hover:bg-gray-50 transition-colors"
              >
                Mark report as resolved
              </button>
            )}
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
              if (r?._id) {
                await updateTaskReport(r._id, {
                  status: "resolved",
                  actionTaken: "task_removed",
                  resolutionNote: "Task removed by admin",
                });
              }
              onSuccess?.();
              onClose();
            }}
            disabled={removeDisabled || !taskId}
            className={`sm:flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${
              removeDisabled ? "bg-orange/40 cursor-not-allowed" : "bg-orange hover:opacity-90"
            }`}
          >
            {removeDisabled ? "Task removed" : "Remove Task"}
          </button>
          <button
            type="button"
            onClick={onBanUser}
            disabled={banDisabled}
            className={`sm:flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${
              banDisabled ? "bg-red-500/40 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {banDisabled ? "User banned" : "Ban User"}
          </button>
          </div>
        </div>

      </div>
    </div>
  );
}