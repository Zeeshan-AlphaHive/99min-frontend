import { request } from "@/utils/api/client";

export function banUser(userId: string, payload: { reason?: string; notes?: string }) {
  return request(`/api/admin/moderation/users/${userId}/ban`, {
    method: "POST",
    body: JSON.stringify(payload),
  }) as Promise<{ success: boolean; message?: string; data: { userId: string; status: string } }>;
}

export function removeTask(taskId: string, payload: { reason?: string; notes?: string }) {
  return request(`/api/admin/moderation/tasks/${taskId}/remove`, {
    method: "POST",
    body: JSON.stringify(payload),
  }) as Promise<{ success: boolean; message?: string; data: { taskId: string; status: string } }>;
}

