"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SubscriptionsHeader from "@/components/subscriptions/SubscriptionsHeader";
import PlanCard, { Plan } from "@/components/subscriptions/PlanCard";
import SuccessModal from "@/components/shared/SuccessModal";
import ChoosePaymentModal from "@/components/subscriptions/ChoosePaymentMethodModal";
import DowngradeConfirmModal from "@/components/subscriptions/Downgradeconfirmmodal";
import { Button } from "@/components/ui";
import { Check, Loader2, Settings } from "lucide-react";
import { useSubscription } from "@/hooks/UseSubscription";
import { usePaymentMethods } from "@/hooks/UsePaymentMethod";

const PLAN_RANK: Record<string, number> = { free: 0, pro: 1, business: 2 };

const SubscriptionsPage: React.FC = () => {
  const searchParams   = useSearchParams();
  const t              = useTranslations();
  const stripeSuccess  = searchParams.get("success")  === "true";
  const planFromUrl    = searchParams.get("plan") as string | null;
  const stripeCanceled = searchParams.get("canceled") === "true";

  const {
    currentPlan, isPaidPlan, renewsAt, cancelAtPeriodEnd,
    loading, checkoutLoading, cancelLoading, portalLoading, error,
    handleUpgrade, handleCancel, handleManage,
  } = useSubscription();

  const { methods: paymentMethods, loading: methodsLoading } = usePaymentMethods();
  const defaultCard = paymentMethods.find((m) => m.isDefault) ?? paymentMethods[0] ?? null;

  const [pendingUpgradePlanId,   setPendingUpgradePlanId]   = useState<string | null>(null);
  const [pendingDowngradePlanId, setPendingDowngradePlanId] = useState<string | null>(null);

  const planDefs = [
    {
      id: "free", name: t("subscriptions.free"), price: "0", pricePeriod: t("subscriptions.forever"),
      features: [
        { text: t("subscriptions.freeFeatures.f1") }, { text: t("subscriptions.freeFeatures.f2") },
        { text: t("subscriptions.freeFeatures.f3") }, { text: t("subscriptions.freeFeatures.f4") },
      ],
    },
    {
      id: "pro", name: t("subscriptions.pro"), price: "9.99", pricePeriod: t("subscriptions.perMonth"),
      features: [
        { text: t("subscriptions.proFeatures.f1") }, { text: t("subscriptions.proFeatures.f2") },
        { text: t("subscriptions.proFeatures.f3") }, { text: t("subscriptions.proFeatures.f4") },
        { text: t("subscriptions.proFeatures.f5") }, { text: t("subscriptions.proFeatures.f6") },
      ],
    },
    {
      id: "business", name: t("subscriptions.business"), price: "29.99", pricePeriod: t("subscriptions.perMonth"),
      features: [
        { text: t("subscriptions.businessFeatures.f1") }, { text: t("subscriptions.businessFeatures.f2") },
        { text: t("subscriptions.businessFeatures.f3") }, { text: t("subscriptions.businessFeatures.f4") },
        { text: t("subscriptions.businessFeatures.f5") }, { text: t("subscriptions.businessFeatures.f6") },
      ],
    },
  ];

  const plans: Plan[] = planDefs.map((p) => ({
    ...p,
    isCurrent:   p.id === currentPlan,
    isDowngrade: PLAN_RANK[p.id] < PLAN_RANK[currentPlan],
  }));

  const getPlan     = (id: string) => plans.find((p) => p.id === id);
  const getPlanName = (id: string) => getPlan(id)?.name ?? t("subscriptions.plan");

  const dismissSuccessParam = () => window.history.replaceState({}, "", "/dashboard/subscriptions");

  const handlePlanUpgradeClick = (planId: string) => {
    if (defaultCard) setPendingUpgradePlanId(planId);
    else handleUpgrade(planId, false);
  };

  const handleUseSavedCard = async () => {
    if (!pendingUpgradePlanId) return;
    await handleUpgrade(pendingUpgradePlanId, true);
    setPendingUpgradePlanId(null);
  };

  const handleUseNewCard = async () => {
    if (!pendingUpgradePlanId) return;
    const id = pendingUpgradePlanId;
    setPendingUpgradePlanId(null);
    await handleUpgrade(id, false);
  };

  const handlePlanDowngradeClick = (planId: string) => setPendingDowngradePlanId(planId);

  const handleDowngradeConfirm = async () => {
    await handleCancel();
    setPendingDowngradePlanId(null);
  };

  const pendingUpgradePlan   = pendingUpgradePlanId   ? getPlan(pendingUpgradePlanId)   : null;
  const pendingDowngradePlan = pendingDowngradePlanId ? getPlan(pendingDowngradePlanId) : null;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        <SubscriptionsHeader />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-textBlack mb-2">{t("subscriptions.title")}</h1>
            <p className="text-textGray text-base">{t("subscriptions.subtitle")}</p>
          </div>

          {stripeCanceled && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {t("subscriptions.canceledNotice")}
            </div>
          )}

          {cancelAtPeriodEnd && renewsAt && (
            <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm text-center">
              {t("subscriptions.downgradeNotice")}{" "}
              <span className="font-semibold">
                {new Date(renewsAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
              </span>.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          {isPaidPlan && (
            <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div>
                <p className="text-sm font-semibold text-textBlack">{getPlanName(currentPlan)} {t("subscriptions.plan")}</p>
                {renewsAt && (
                  <p className="text-xs text-textGray mt-0.5">
                    {cancelAtPeriodEnd ? t("subscriptions.expires") : t("subscriptions.renews")}{" "}
                    {new Date(renewsAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Button variant="secondary" size="sm" onClick={handleManage} disabled={portalLoading}>
                {portalLoading
                  ? <Loader2 className="w-4 h-4 animate-spin mr-1.5 inline-block" />
                  : <Settings className="w-4 h-4 mr-1.5 inline-block" />}
                {t("subscriptions.manageBilling")}
              </Button>
            </div>
          )}

          {loading || methodsLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-orange" />
            </div>
          ) : (
            <div className="space-y-6">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan}
                  onUpgrade={handlePlanUpgradeClick}
                  onDowngrade={handlePlanDowngradeClick}
                  upgradeLoading={checkoutLoading} />
              ))}
            </div>
          )}
        </div>

        {pendingUpgradePlan && defaultCard && (
          <ChoosePaymentModal
            isOpen={!!pendingUpgradePlanId}
            onClose={() => setPendingUpgradePlanId(null)}
            planName={pendingUpgradePlan.name}
            planPrice={pendingUpgradePlan.price}
            savedCard={{ brand: defaultCard.brand ?? "", last4: defaultCard.last4 ?? "****",
              expMonth: defaultCard.expMonth ?? "", expYear: defaultCard.expYear ?? "" }}
            onUseSavedCard={handleUseSavedCard}
            onUseNewCard={handleUseNewCard}
            loading={checkoutLoading}
          />
        )}

        {pendingDowngradePlan && (
          <DowngradeConfirmModal
            isOpen={!!pendingDowngradePlanId}
            onClose={() => setPendingDowngradePlanId(null)}
            currentPlanName={getPlanName(currentPlan)}
            targetPlanName={pendingDowngradePlan.name}
            renewsAt={renewsAt}
            onConfirm={handleDowngradeConfirm}
            loading={cancelLoading}
          />
        )}

        <SuccessModal
          isOpen={stripeSuccess}
          onClose={dismissSuccessParam}
          title={t("subscriptions.upgradeSuccess")}
          description={
            <>{t("subscriptions.upgradeSuccessDesc")}{" "}
              <span className="font-bold">{getPlanName(planFromUrl || currentPlan)}</span>{" "}
              {t("subscriptions.upgradeSuccessDesc2")}</>
          }
          buttonText={t("common.gotIt")}
          icon={<Check className="w-10 h-10" strokeWidth={3} />}
        />
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionsPage;