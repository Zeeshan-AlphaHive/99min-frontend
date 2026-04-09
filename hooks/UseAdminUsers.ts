import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminUsers, updateAdminUserStatus } from '@/utils/api/admin.users.api';

export const useAdminUsers = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  plan?: string;
}) =>
  useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => fetchAdminUsers(params),
  });

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status, reason }: {
      userId: string;
      status: 'active' | 'suspended' | 'banned' | 'deleted';
      reason?: string;
    }) => updateAdminUserStatus(userId, status, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};