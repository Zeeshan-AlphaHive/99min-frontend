import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminSubscriptions,
  fetchSubscriptionStats,
  cancelAdminSubscription,
} from '@/utils/api/admin.subscriptions.api';

export const useAdminSubscriptions = (params: {
  page?: number; limit?: number; status?: string; plan?: string; search?: string;
}) =>
  useQuery({
    queryKey: ['admin-subscriptions', params],
    queryFn:  () => fetchAdminSubscriptions(params),
  });

export const useSubscriptionStats = () =>
  useQuery({
    queryKey: ['subscription-stats'],
    queryFn:  fetchSubscriptionStats,
  });

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      cancelAdminSubscription(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-stats'] });
    },
  });
};