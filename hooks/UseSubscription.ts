import { useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAccessToken } from "@/utils/api/client";
import {
  getMySubscription,
  createCheckoutSession,
  createPortalSession,
  Subscription,
  PlanId,
} from "@/utils/api/subscription.api";

export const subscriptionQueryKey = ["subscription"];

export function useSubscription() {
  // ── Fetch current subscription ────────────────────────────────────────────
  // FIX: Only run the query when an access token is present.
  // Without this guard, the query fires immediately on page load before
  // the auth token is restored, causing a 401 error on every settings page.
  const {
    data: subscription,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: subscriptionQueryKey,
    queryFn: () => getMySubscription().then((res) => res.data),
    enabled: !!getAccessToken(),   // ← don't run until token is available
    retry: false,
  });

  // ── Checkout ──────────────────────────────────────────────────────────────
  const {
    mutateAsync: checkoutMutate,
    isPending: checkoutLoading,
    error: checkoutError,
  } = useMutation({
    mutationFn: (planId: string) =>
      createCheckoutSession(planId).then((res) => res.data),
  });

  const handleUpgrade = useCallback(
    async (planId: string): Promise<void> => {
      const session = await checkoutMutate(planId);
      window.location.href = session.url;
    },
    [checkoutMutate]
  );

  // ── Portal ────────────────────────────────────────────────────────────────
  const {
    mutateAsync: portalMutate,
    isPending: portalLoading,
    error: portalError,
  } = useMutation({
    mutationFn: () => createPortalSession().then((res) => res.data),
  });

  const handleManage = useCallback(async (): Promise<void> => {
    const session = await portalMutate();
    window.location.href = session.url;
  }, [portalMutate]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentPlan: PlanId = subscription?.plan ?? "free";
  const isActive =
    subscription?.status === "active" ||
    subscription?.status === "trialing" ||
    subscription?.plan === "free";
  const isPaidPlan = currentPlan === "pro" || currentPlan === "business";
  const renewsAt = subscription?.currentPeriodEnd ?? null;

  // ── Error aggregation ─────────────────────────────────────────────────────
  const error =
    (queryError instanceof Error ? queryError.message : queryError ? "Failed to load subscription" : null) ??
    (checkoutError instanceof Error ? checkoutError.message : checkoutError ? "Failed to start checkout" : null) ??
    (portalError instanceof Error ? portalError.message : portalError ? "Failed to open billing portal" : null);

  return {
    subscription,
    currentPlan,
    isActive,
    isPaidPlan,
    renewsAt,
    loading,
    checkoutLoading,
    portalLoading,
    error,
    handleUpgrade,
    handleManage,
  };
}