import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  fetchTasks,
  fetchTaskById,
  fetchTaskResponses,
  createTask,
  updateTask,
  deleteTask,
  respondToTask,
  reportTask,
  shareTask,
  uploadMedia,
  type TaskListParams,
  type CreateTaskPayload,
  type RespondToTaskPayload,
  type ReportTaskPayload,
  type ApiListResponse,
  type ApiTaskResponse,
} from "@/utils/api/tasks.api"; 

// ─── Query key factory ────────────────────────────────────────────────────────
// Centralised so any invalidation call stays in sync with query definitions.

export const taskKeys = {
  all:       ["tasks"] as const,
  lists:     () => [...taskKeys.all, "list"] as const,
  list:      (params?: TaskListParams) => [...taskKeys.lists(), params] as const,
  details:   () => [...taskKeys.all, "detail"] as const,
  detail:    (id: string) => [...taskKeys.details(), id] as const,
  responses: (id: string) => [...taskKeys.detail(id), "responses"] as const,
};

// ─── Queries (read) ───────────────────────────────────────────────────────────

/**
 * Fetch a list of tasks with optional filters.
 *
 * @example
 * const { data, isLoading, error } = useTasks({ status: "active", sort: "newest" });
 * const tasks = data?.data ?? [];
 */
export function useTasks(
  params?: TaskListParams,
  options?: Omit<UseQueryOptions<ApiListResponse>, "queryKey" | "queryFn">
) {
  return useQuery<ApiListResponse>({
    queryKey: taskKeys.list(params),
    queryFn: () => fetchTasks(params),
    staleTime: 30_000, // 30 s — tasks change often but not on every render
    ...options,
  });
}

/**
 * Fetch a single task by ID.
 *
 * @example
 * const { data } = useTask(taskId);
 * const task = data?.data;
 */
export function useTask(
  taskId: string,
  options?: Omit<UseQueryOptions<ApiTaskResponse>, "queryKey" | "queryFn">
) {
  return useQuery<ApiTaskResponse>({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => fetchTaskById(taskId),
    enabled: !!taskId,
    staleTime: 60_000,
    ...options,
  });
}

/**
 * Fetch responses for a task (task owner only).
 *
 * @example
 * const { data } = useTaskResponses(taskId);
 */
export function useTaskResponses(taskId: string) {
  return useQuery({
    queryKey: taskKeys.responses(taskId),
    queryFn: () => fetchTaskResponses(taskId),
    enabled: !!taskId,
  });
}

// ─── Mutations (write) ────────────────────────────────────────────────────────

/**
 * Create a new task.
 * Automatically invalidates the task list cache on success.
 *
 * @example
 * const { mutateAsync: create, isPending } = useCreateTask();
 * await create(payload);
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { payload: CreateTaskPayload; idempotencyKey?: string }) =>
      createTask(args.payload, { idempotencyKey: args.idempotencyKey }),
    onSuccess: () => {
      // Refresh all task list queries so the new task appears immediately
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

/**
 * Update an existing task.
 * Invalidates both the list and the individual task detail cache.
 *
 * @example
 * const { mutateAsync: update } = useUpdateTask(taskId);
 * await update({ title: "New title" });
 */
export function useUpdateTask(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<CreateTaskPayload>) => updateTask(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

/**
 * Cancel / soft-delete a task.
 * Removes the task from the list cache immediately (optimistic-style).
 *
 * @example
 * const { mutate: remove } = useDeleteTask();
 * remove(taskId);
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: (_data, taskId) => {
      // Remove stale detail
      queryClient.removeQueries({ queryKey: taskKeys.detail(taskId) });
      // Refetch lists so the cancelled task disappears
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

/**
 * Respond to a task (helper).
 * Invalidates the responses list so the count refreshes.
 *
 * @example
 * const { mutateAsync: respond } = useRespondToTask(taskId);
 * await respond({ message: "I can help!", offeredPrice: 20 });
 */
export function useRespondToTask(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RespondToTaskPayload) => respondToTask(taskId, payload),
    onSuccess: () => {
      // Refresh task detail (interestCount changes server-side)
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.responses(taskId) });
    },
  });
}

/**
 * Report a task.
 *
 * @example
 * const { mutateAsync: report } = useReportTask(taskId);
 * await report({ reason: "spam", details: "Posted 3 times" });
 */
export function useReportTask(taskId: string) {
  return useMutation({
    mutationFn: (payload: ReportTaskPayload) => reportTask(taskId, payload),
  });
}

/**
 * Record a share event (analytics, fire-and-forget).
 * Uses mutate (not mutateAsync) since we don't await the result in the UI.
 *
 * @example
 * const { mutate: share } = useShareTask();
 * share(taskId);
 */
export function useShareTask() {
  return useMutation({
    mutationFn: (taskId: string) => shareTask(taskId),
  });
}

/**
 * Upload media files before creating a task.
 * Returns public URLs from the backend.
 *
 * @example
 * const { mutateAsync: upload, isPending: uploading } = useUploadMedia();
 * const urls = await upload(files);
 */
export function useUploadMedia() {
  return useMutation({
    mutationFn: (files: File[]) => uploadMedia(files),
  });
}