import { request } from './client';
import type { Pagination } from './admin.users.api';

export type AdminSubscription = {
  _id: string;
  userId: { _id: string; name: string; email: string; avatar: string };
  plan: 'free' | 'pro' | 'business';
  status: 'free' | 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
};

export type SubscriptionStats = {
  totalActive: number;
  totalCanceled: number;
  mrr: number;
  churnRate: number;
  byPlan: { pro: number; business: number };
};

type ListR = { success: boolean; data: { items: AdminSubscription[]; pagination: Pagination } };
type StatR = { success: boolean; data: SubscriptionStats };

export const fetchAdminSubscriptions = (params: {
  page?: number; limit?: number; status?: string; plan?: string; search?: string;
}) => {
  const q = new URLSearchParams();
  if (params.page)   q.set('page',   String(params.page));
  if (params.limit)  q.set('limit',  String(params.limit));
  if (params.status) q.set('status', params.status);
  if (params.plan)   q.set('plan',   params.plan);
  if (params.search) q.set('search', params.search);
  return request<ListR>(`/api/admin/subscriptions?${q.toString()}`);
};

export const fetchSubscriptionStats = () =>
  request<StatR>('/api/admin/subscriptions/stats');

export const cancelAdminSubscription = (id: string, reason: string) =>
  request(`/api/admin/subscriptions/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });