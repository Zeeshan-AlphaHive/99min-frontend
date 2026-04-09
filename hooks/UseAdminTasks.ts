import { useQuery } from '@tanstack/react-query';
import { fetchAdminTasks } from '@/utils/api/admin.users.api';

export const useAdminTasks = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
}) =>
  useQuery({
    queryKey: ['admin-tasks', params],
    queryFn: () => fetchAdminTasks(params),
  });