"use client";

import React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface DowngradeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanName: string;
  targetPlanName: string;
  renewsAt: string | null; // ISO date string
  onConfirm: () => void;
  loading?: boolean;
}

const DowngradeConfirmModal: React.FC<DowngradeConfirmModalProps> = ({
  isOpen,
  onClose,
  currentPlanName,
  targetPlanName,
  renewsAt,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  const expiryDate = renewsAt
    ? new Date(renewsAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-textBlack font-bold text-lg">Downgrade Plan?</h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <p className="text-textGray text-sm mb-2">
          You are currently on the{" "}
          <span className="font-semibold text-textBlack">{currentPlanName}</span> plan.
          Downgrading to{" "}
          <span className="font-semibold text-textBlack">{targetPlanName}</span> means
          you will lose access to:
        </p>

        {/* What they lose */}
        <ul className="text-sm text-red-500 space-y-1 mb-4 pl-4 list-disc">
          {targetPlanName === "Free" && (
            <>
              <li>Priority ad placement</li>
              <li>Extended ad duration</li>
              <li>Analytics dashboard</li>
              <li>Priority support</li>
            </>
          )}
          {targetPlanName === "Pro" && (
            <>
              <li>Team accounts</li>
              <li>API access</li>
              <li>Dedicated account manager</li>
            </>
          )}
        </ul>

        {/* Period end notice */}
        {expiryDate && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 mb-5 text-xs text-yellow-700">
            Your {currentPlanName} benefits will remain active until{" "}
            <span className="font-semibold">{expiryDate}</span>, then your plan
            will switch to {targetPlanName}.
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-textBlack font-semibold text-sm hover:bg-gray-50 transition disabled:opacity-50"
          >
            Keep {currentPlanName}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Downgrade
          </button>
        </div>
      </div>
    </div>
  );
};

export default DowngradeConfirmModal;