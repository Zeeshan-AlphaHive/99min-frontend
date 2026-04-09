import { request } from './client';

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: 'active' | 'suspended' | 'banned' | 'deleted';
  plan: string;
  tasksPosted: number;
  createdAt: string;
};

export type AdminTask = {
  _id: string;
  title: string;
  description: string;
  posterUserId: { _id: string; name: string; avatar: string; plan: string; status: string };
  budget: { min: number; max: number; currency: string };
  location: { label: string };
  status: 'active' | 'expired' | 'cancelled' | 'removed' | 'flagged';
  category: string;
  interestCount: number;
  expiresAt: string;
  createdAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

type ListResponse<T> = {
  success: boolean;
  data: { items: T[]; pagination: Pagination };
};

// ── Users ──────────────────────────────────────────────────────────────────

export const fetchAdminUsers = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  plan?: string;
}) => {
  const q = new URLSearchParams();
  if (params.page)   q.set('page',   String(params.page));
  if (params.limit)  q.set('limit',  String(params.limit));
  if (params.search) q.set('search', params.search);
  if (params.status) q.set('status', params.status);
  if (params.plan)   q.set('plan',   params.plan);

  return request<ListResponse<AdminUser>>(`/api/admin/users?${q.toString()}`);
};

export const updateAdminUserStatus = (
  userId: string,
  status: 'active' | 'suspended' | 'banned' | 'deleted',
  reason?: string
) =>
  request(`/api/admin/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, ...(reason ? { reason } : {}) }),
  });

// ── Tasks ──────────────────────────────────────────────────────────────────

export const fetchAdminTasks = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
}) => {
  const q = new URLSearchParams();
  if (params.page)     q.set('page',     String(params.page));
  if (params.limit)    q.set('limit',    String(params.limit));
  if (params.search)   q.set('search',   params.search);
  if (params.status)   q.set('status',   params.status);
  if (params.category) q.set('category', params.category);

  return request<ListResponse<AdminTask>>(`/api/admin/tasks?${q.toString()}`);
};