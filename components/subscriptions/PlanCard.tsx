"use client";

import React from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";

export interface PlanFeature {
  text: string;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  pricePeriod: string;
  features: PlanFeature[];
  isCurrent?: boolean;
  isDowngrade?: boolean; // true when this plan is lower than the current one
}

interface PlanCardProps {
  plan: Plan;
  onUpgrade?: (planId: string) => void;
  onDowngrade?: (planId: string) => void;
  upgradeLoading?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onUpgrade,
  onDowngrade,
  upgradeLoading = false,
}) => {
  const isCurrent  = plan.isCurrent  ?? false;
  const isDowngrade = plan.isDowngrade ?? false;

  return (
    <div
      className={`rounded-2xl p-6 border-2 ${
        isCurrent ? "border-orange bg-iconBg" : "border-gray-200 bg-white"
      } shadow-sm relative`}
    >
      {/* Current Plan Badge */}
      {isCurrent && (
        <div className="absolute top-4 right-4 bg-orange text-white text-xs font-bold px-3 py-1 rounded-full">
          Current Plan
        </div>
      )}

      {/* Plan Name */}
      <h3 className="text-2xl font-black text-textBlack mb-2">{plan.name}</h3>

      {/* Price */}
      <div className="mb-6">
        <span className="text-3xl font-black text-orange">${plan.price}</span>
        <span className="text-textGray text-base font-medium ml-1">
          {plan.pricePeriod}
        </span>
      </div>

      {/* Features List */}
      <div className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="bg-lightGreen rounded-full p-1.5">
              <Check className="w-5 h-5 text-green shrink-0 mt-0.5" strokeWidth={3} />
            </div>
            <span className="text-textBlack text-sm leading-relaxed">
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      {isCurrent ? (
        <Button variant="secondary" size="md" fullWidth disabled>
          Current Plan
        </Button>
      ) : isDowngrade ? (
        <Button
          variant="secondary"
          size="md"
          fullWidth
          disabled={upgradeLoading}
          onClick={() => onDowngrade?.(plan.id)}
        >
          {upgradeLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" />
          ) : null}
          Downgrade to {plan.name}
        </Button>
      ) : (
        <Button
          variant="primary"
          size="md"
          fullWidth
          disabled={upgradeLoading}
          onClick={() => onUpgrade?.(plan.id)}
        >
          {upgradeLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" />
          ) : null}
          Upgrade to {plan.name}
        </Button>
      )}
    </div>
  );
};

export default PlanCard;