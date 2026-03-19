import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAccessToken } from "@/utils/api/client";
import {
  getMySubscription,
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
  PlanId,
} from "@/utils/api/subscription.api";

export const subscriptionQueryKey = ["subscription"];

type CheckoutResult =
  | { url: string; requiresAction?: never; success?: never; clientSecret?: never }
  | { requiresAction: true; clientSecret: string; url?: never; success?: never }
  | { success: true; url?: never; requiresAction?: never; clientSecret?: never };

export function useSubscription() {
  const queryClient = useQueryClient();

  const {
    data: subscription,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: subscriptionQueryKey,
    queryFn: () => getMySubscription().then((res) => res.data),
    enabled: !!getAccessToken(),
    retry: false,
  });

  // ── Checkout (upgrade) ────────────────────────────────────────────────────
  const {
    mutateAsync: checkoutMutate,
    isPending: checkoutLoading,
    error: checkoutError,
  } = useMutation({
    mutationFn: ({ planId, useSavedCard }: { planId: string; useSavedCard: boolean }) =>
      createCheckoutSession(planId, useSavedCard).then((res) => res.data as CheckoutResult),
  });

  const handleUpgrade = useCallback(
    async (planId: string, useSavedCard = false): Promise<void> => {
      const result = await checkoutMutate({ planId, useSavedCard });

      if (result.url) {
        window.location.href = result.url;
        return;
      }

      if (result.requiresAction && result.clientSecret) {
        const { loadStripe } = await import("@stripe/stripe-js");
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        if (!stripe) throw new Error("Stripe failed to load.");
        const { error } = await stripe.confirmCardPayment(result.clientSecret);
        if (error) throw new Error(error.message);
        window.location.href = `/dashboard/subscriptions?success=true&plan=${planId}`;
        return;
      }

      if (result.success) {
        window.location.href = `/dashboard/subscriptions?success=true&plan=${planId}`;
      }
    },
    [checkoutMutate]
  );

  // ── Cancel / downgrade to free ────────────────────────────────────────────
  const {
    mutateAsync: cancelMutate,
    isPending: cancelLoading,
    error: cancelError,
  } = useMutation({
    mutationFn: () => cancelSubscription().then((res) => res.data),
    onSuccess: () => {
      // Refresh subscription so UI reflects cancelAtPeriodEnd: true immediately
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKey });
    },
  });

  const handleCancel = useCallback(async (): Promise<void> => {
    await cancelMutate();
  }, [cancelMutate]);

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
  const cancelAtPeriodEnd = subscription?.cancelAtPeriodEnd ?? false;

  const error =
    (queryError instanceof Error ? queryError.message : queryError ? "Failed to load subscription" : null) ??
    (checkoutError instanceof Error ? checkoutError.message : checkoutError ? "Failed to start checkout" : null) ??
    (cancelError instanceof Error ? cancelError.message : cancelError ? "Failed to cancel subscription" : null) ??
    (portalError instanceof Error ? portalError.message : portalError ? "Failed to open billing portal" : null);

  return {
    subscription,
    currentPlan,
    isActive,
    isPaidPlan,
    renewsAt,
    cancelAtPeriodEnd,
    loading,
    checkoutLoading,
    cancelLoading,
    portalLoading,
    error,
    handleUpgrade,
    handleCancel,
    handleManage,
  };
}