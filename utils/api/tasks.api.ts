
import { request, getAccessToken } from "@/utils/api/client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Payload / param types ────────────────────────────────────────────────────

export interface CreateTaskPayload {
  title: string;
  description: string;
  category: string;
  budget: { min: number; max: number };
  location: { label: string; coordinates?: [number, number] };
  duration: "90_mins" | "24_hours";
  urgent?: boolean;
  tags?: string[];
  media?: string[];
}

export interface TaskListParams {
  category?: string;
  status?: "active" | "expired" | "cancelled";
  q?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "expiring" | "popular";
  page?: number;
  limit?: number;
}

export interface RespondToTaskPayload {
  message: string;
  offeredPrice?: number;
}

export interface ReportTaskPayload {
  reason: "spam" | "inappropriate" | "scam" | "duplicate" | "other";
  details?: string;
}

// ─── Response shapes (mirrors backend) ───────────────────────────────────────

export interface ApiTask {
  _id: string;
  title: string;
  description: string;
  budget: { min: number; max: number; currency: string };
  location: { label: string };
  expiresAt: string;
  createdAt: string;
  interestCount: number;
  urgent: boolean;
  category: string;
  tags: string[];
  media: string[];
  status: "active" | "expired" | "cancelled";
  posterUserId: { _id: string; name: string; avatar?: string };
}

export interface ApiListResponse {
  success: boolean;
  data: ApiTask[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ApiTaskResponse {
  success: boolean;
  data: ApiTask;
}

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * GET /api/tasks
 * Fetch a paginated, filtered list of tasks.
 */
export function fetchTasks(params?: TaskListParams): Promise<ApiListResponse> {
  const qs = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return request(`/api/tasks${qs}`) as Promise<ApiListResponse>;
}

/**
 * GET /api/tasks/:taskId
 */
export function fetchTaskById(taskId: string): Promise<ApiTaskResponse> {
  return request(`/api/tasks/${taskId}`) as Promise<ApiTaskResponse>;
}

/**
 * POST /api/tasks  (auth required)
 */
export function createTask(
  payload: CreateTaskPayload,
  options?: { idempotencyKey?: string }
): Promise<ApiTaskResponse> {
  return request("/api/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: options?.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey } : undefined,
  }) as Promise<ApiTaskResponse>;
}

/**
 * PATCH /api/tasks/:taskId  (auth required)
 */
export function updateTask(
  taskId: string,
  payload: Partial<CreateTaskPayload>
): Promise<ApiTaskResponse> {
  return request(`/api/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }) as Promise<ApiTaskResponse>;
}

/**
 * DELETE /api/tasks/:taskId  (auth required)
 */
export function deleteTask(taskId: string): Promise<{ success: boolean; message: string }> {
  return request(`/api/tasks/${taskId}`, { method: "DELETE" }) as Promise<{
    success: boolean;
    message: string;
  }>;
}

/**
 * POST /api/tasks/:taskId/respond  (auth required)
 */
export function respondToTask(
  taskId: string,
  payload: RespondToTaskPayload
): Promise<{ success: boolean; data: unknown }> {
  return request(`/api/tasks/${taskId}/respond`, {
    method: "POST",
    body: JSON.stringify(payload),
  }) as Promise<{ success: boolean; data: unknown }>;
}

/**
 * GET /api/tasks/:taskId/responses  (auth required — task owner only)
 */
export function fetchTaskResponses(
  taskId: string
): Promise<{ success: boolean; count: number; data: unknown[] }> {
  return request(`/api/tasks/${taskId}/responses`) as Promise<{
    success: boolean;
    count: number;
    data: unknown[];
  }>;
}

/**
 * POST /api/tasks/:taskId/report  (auth required)
 */
export function reportTask(
  taskId: string,
  payload: ReportTaskPayload
): Promise<{ success: boolean; data: unknown }> {
  return request(`/api/tasks/${taskId}/report`, {
    method: "POST",
    body: JSON.stringify(payload),
  }) as Promise<{ success: boolean; data: unknown }>;
}

/**
 * POST /api/tasks/:taskId/share  (public)
 */
export function shareTask(
  taskId: string
): Promise<{ success: boolean; data: { taskId: string; shared: boolean; sharedAt: string } }> {
  return request(`/api/tasks/${taskId}/share`, { method: "POST" }) as Promise<{
    success: boolean;
    data: { taskId: string; shared: boolean; sharedAt: string };
  }>;
}

/**
 * POST /api/upload
 * Upload media files and receive public URLs back.
 */
export async function uploadMedia(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const token = getAccessToken();

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    credentials: "include",
    headers: {
      // Do NOT set Content-Type — browser sets multipart/form-data boundary automatically
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data.urls as string[];
}