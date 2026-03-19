"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SubscriptionsHeader from "@/components/subscriptions/SubscriptionsHeader";
import PlanCard, { Plan } from "@/components/subscriptions/PlanCard";
import SuccessModal from "@/components/shared/SuccessModal";
import { Button } from "@/components/ui";
import { Check, Loader2, Settings } from "lucide-react";
import { useSubscription } from "@/hooks/UseSubscription";
import { useI18n } from "@/contexts/i18n-context";

const SubscriptionsPage: React.FC = () => {
  const { tr } = useI18n();
  const searchParams = useSearchParams();
  const stripeSuccess  = searchParams.get("success")  === "true";
  const planFromUrl    = searchParams.get("plan") as string | null;
  const stripeCanceled = searchParams.get("canceled") === "true";

  const {
    currentPlan,
    isPaidPlan,
    renewsAt,
    loading,
    checkoutLoading,
    portalLoading,
    error,
    handleUpgrade,
    handleManage,
  } = useSubscription();

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: "0",
      pricePeriod: "/ forever",
      isCurrent: currentPlan === "free",
      features: [
        { text: "Post up to 3 ads per day" },
        { text: "Respond to unlimited tasks" },
        { text: "Basic support" },
        { text: "Ads expire in 99 minutes" },
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "9.99",
      pricePeriod: "/ per month",
      isCurrent: currentPlan === "pro",
      features: [
        { text: "Post unlimited ads" },
        { text: "Priority ad placement" },
        { text: "Extended ad duration (up to 3 hours)" },
        { text: "Priority support" },
        { text: "Analytics dashboard" },
        { text: "Custom location radius" },
      ],
    },
    {
      id: "business",
      name: "Business",
      price: "29.99",
      pricePeriod: "/ per month",
      isCurrent: currentPlan === "business",
      features: [
        { text: "Everything in Pro" },
        { text: "Team accounts (up to 5 members)" },
        { text: "API access" },
        { text: "Dedicated account manager" },
        { text: "Custom integrations" },
        { text: "Advanced analytics" },
      ],
    },
  ];

  const getPlanName = (planId: string) =>
    plans.find((p) => p.id === planId)?.name || "Plan";

  const dismissSuccessParam = () => {
    // Remove query params without a full navigation
    window.history.replaceState({}, "", "/dashboard/subscriptions");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        <SubscriptionsHeader />

        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-textBlack mb-2">
              {tr("Choose Your Plan")}
            </h1>
            <p className="text-textGray text-base">
              {tr("Upgrade to unlock more features")}
            </p>
          </div>

          {/* Canceled notice */}
          {stripeCanceled && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {tr("Payment was canceled — you can try again anytime.")}
            </div>
          )}

          {/* API error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          {/* Manage billing (paid plans only) */}
          {isPaidPlan && (
            <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div>
                <p className="text-sm font-semibold text-textBlack">
                  {tr(`${getPlanName(currentPlan)} Plan`)}
                </p>
                {renewsAt && (
                  <p className="text-xs text-textGray mt-0.5">
                    {tr(`Renews ${new Date(renewsAt).toLocaleDateString()}`)}
                  </p>
                )}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleManage}
                disabled={portalLoading}
              >
                {portalLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5 inline-block" />
                ) : (
                  <Settings className="w-4 h-4 mr-1.5 inline-block" />
                )}
                {tr("Manage Billing")}
              </Button>
            </div>
          )}

          {/* Plan Cards */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-orange" />
            </div>
          ) : (
            <div className="space-y-6">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onUpgrade={handleUpgrade}
                  upgradeLoading={checkoutLoading}
                />
              ))}
            </div>
          )}
        </div>

        {/* Success Modal — fires when Stripe redirects back with ?success=true */}
        <SuccessModal
          isOpen={stripeSuccess}
          onClose={dismissSuccessParam}
          title={tr("Upgrade Successful!")}
          description={
            <>
              {tr("You have successfully upgraded to the")}{" "}
              <span className="font-bold">{tr(getPlanName(planFromUrl || currentPlan))}</span>{" "}
              {tr("plan.")}
            </>
          }
          buttonText={tr("Got it")}
          icon={<Check className="w-10 h-10" strokeWidth={3} />}
        />
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionsPage;