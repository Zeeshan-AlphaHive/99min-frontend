import { request } from "@/utils/api/client";

// ── Types ─────────────────────────────────────────────────────────────────────

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

export interface CheckoutSession {
  url: string;
  sessionId: string;
}

export interface PortalSession {
  url: string;
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function getMySubscription(): Promise<{
  success: boolean;
  data: Subscription;
}> {
  return request("/api/subscriptions/me");
}

export async function createCheckoutSession(planId: string): Promise<{
  success: boolean;
  data: CheckoutSession;
}> {
  return request("/api/subscriptions/checkout", {
    method: "POST",
    body: JSON.stringify({ planId }),
  });
}

export async function createPortalSession(): Promise<{
  success: boolean;
  data: PortalSession;
}> {
  return request("/api/subscriptions/portal", { method: "POST" });
}