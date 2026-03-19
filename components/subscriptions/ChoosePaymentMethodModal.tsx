"use client";

/**
 * ChoosePaymentModal
 *
 * Shown when the user clicks "Upgrade" and already has a saved default card.
 * Lets them either charge that card immediately or go to Stripe Checkout to
 * enter a different card.
 */

import React from "react";
import { CreditCard, ExternalLink, X } from "lucide-react";

interface SavedCard {
  brand: string;
  last4: string;
  expMonth: number | string;
  expYear: number | string;
}

interface ChoosePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: string;
  savedCard: SavedCard;
  /** User chose to charge the saved card */
  onUseSavedCard: () => void;
  /** User chose to enter a different card via Stripe Checkout */
  onUseNewCard: () => void;
  loading?: boolean;
}

const BRAND_LABELS: Record<string, string> = {
  visa:       "Visa",
  mastercard: "Mastercard",
  amex:       "American Express",
  discover:   "Discover",
};

const ChoosePaymentModal: React.FC<ChoosePaymentModalProps> = ({
  isOpen,
  onClose,
  planName,
  planPrice,
  savedCard,
  onUseSavedCard,
  onUseNewCard,
  loading = false,
}) => {
  if (!isOpen) return null;

  const brandLabel = BRAND_LABELS[savedCard.brand?.toLowerCase()] ?? savedCard.brand ?? "Card";
  const expMonth   = String(savedCard.expMonth).padStart(2, "0");
  const expYear    = String(savedCard.expYear).slice(-2);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-textBlack font-bold text-lg">Choose Payment</h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <p className="text-textGray text-sm mb-5">
          Upgrading to <span className="font-semibold text-textBlack">{planName}</span>{" "}
          — ${planPrice}/month
        </p>

        {/* Option A: use saved card */}
        <button
          onClick={onUseSavedCard}
          disabled={loading}
          className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-orange bg-orange/5 hover:bg-orange/10 transition mb-3 text-left disabled:opacity-50"
        >
          <div className="w-10 h-10 bg-orange/10 rounded-full flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-orange" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-textBlack font-semibold text-sm">
              {brandLabel} •••• {savedCard.last4}
            </p>
            <p className="text-textGray text-xs mt-0.5">
              Expires {expMonth}/{expYear}
            </p>
          </div>
          <span className="text-xs font-semibold text-orange shrink-0">Use this</span>
        </button>

        {/* Option B: enter a different card */}
        <button
          onClick={onUseNewCard}
          disabled={loading}
          className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-left disabled:opacity-50"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
            <ExternalLink className="w-5 h-5 text-textGray" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-textBlack font-semibold text-sm">Use a different card</p>
            <p className="text-textGray text-xs mt-0.5">
              You&apos;ll be redirected to Stripe&apos;s secure checkout
            </p>
          </div>
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Payments are securely processed by Stripe
        </p>
      </div>
    </div>
  );
};

export default ChoosePaymentModal;