import { request } from "@/utils/api/client";

export type PlanId = "free" | "pro" | "business";

export type SubscriptionStatus =
  | "free"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "trialing";

export interface Subscription {
  _id?: string;
  userId?: string;
  plan: PlanId;
  status: SubscriptionStatus;
  stripeSubscriptionId?: string | null;
  stripeCustomerId?: string | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CheckoutSession =
  | { url: string; sessionId: string; requiresAction?: never; success?: never; clientSecret?: never }
  | { requiresAction: true; clientSecret: string; url?: never; sessionId?: never; success?: never }
  | { success: true; url?: never; sessionId?: never; requiresAction?: never; clientSecret?: never };

export interface PortalSession {
  url: string;
}

export interface CancelResult {
  message: string;
  currentPeriodEnd: string | null;
}

export async function getMySubscription(): Promise<{ success: boolean; data: Subscription }> {
  return request("/api/subscriptions/me");
}

export async function createCheckoutSession(
  planId: string,
  useSavedCard = false
): Promise<{ success: boolean; data: CheckoutSession }> {
  return request("/api/subscriptions/checkout", {
    method: "POST",
    body: JSON.stringify({ planId, useSavedCard }),
  });
}

export async function createPortalSession(): Promise<{ success: boolean; data: PortalSession }> {
  return request("/api/subscriptions/portal", { method: "POST" });
}

// Cancels at period end — never pass "free" to createCheckoutSession
export async function cancelSubscription(): Promise<{ success: boolean; data: CancelResult }> {
  return request("/api/subscriptions/cancel", { method: "POST" });
}