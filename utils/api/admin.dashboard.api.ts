import { request } from './client';

export type DashboardStats = {
  users:         { total: number; active: number; suspended: number; newThisMonth: number };
  tasks:         { total: number; active: number; expired: number; removed: number; newThisMonth: number };
  revenue:       { totalMrr: number; totalAllTime: number; newThisMonth: number };
  subscriptions: { pro: number; business: number; free: number };
};

export type ChartPoint  = { date: string; count: number };
export type RevenuePoint = { month: string; revenue: number };
export type CategoryPoint = { category: string; count: number };

type R<T> = { success: boolean; data: T };

export const fetchDashboardStats  = () =>
  request<R<DashboardStats>>('/api/admin/dashboard/stats');

export const fetchUserChart = (period = '30d') =>
  request<R<ChartPoint[]>>(`/api/admin/dashboard/charts/users?period=${period}`);

export const fetchTaskChart = (period = '30d') =>
  request<R<ChartPoint[]>>(`/api/admin/dashboard/charts/tasks?period=${period}`);

export const fetchRevenueChart = (period = '12m') =>
  request<R<RevenuePoint[]>>(`/api/admin/dashboard/charts/revenue?period=${period}`);


export const fetchCategoryChart = () =>
  request<R<CategoryPoint[]>>('/api/admin/dashboard/charts/categories');