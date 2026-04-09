import { useQuery } from '@tanstack/react-query';
import {
  fetchDashboardStats,
  fetchUserChart,
  fetchTaskChart,
  fetchRevenueChart,
  fetchCategoryChart,
} from '@/utils/api/admin.dashboard.api';


export const useDashboardStats = () =>
  useQuery({ queryKey: ['dashboard-stats'], queryFn: fetchDashboardStats, staleTime: 60_000 });

export const useUserChart = (period = '30d') =>
  useQuery({ queryKey: ['dashboard-user-chart', period], queryFn: () => fetchUserChart(period) });

export const useTaskChart = (period = '30d') =>
  useQuery({ queryKey: ['dashboard-task-chart', period], queryFn: () => fetchTaskChart(period) });

export const useRevenueChart = (period = '12m') =>
  useQuery({ queryKey: ['dashboard-revenue-chart', period], queryFn: () => fetchRevenueChart(period) });

export const useCategoryChart = () =>
  useQuery({ queryKey: ['dashboard-category-chart'], queryFn: fetchCategoryChart });