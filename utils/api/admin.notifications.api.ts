import { request } from "@/utils/api/client";

export type AdminNotificationType =
  | "user_joined"
  | "task_created"
  | "task_reported"
  | "user_reported"
  | "system";

export interface AdminNotification {
  _id: string;
  type: AdminNotificationType | string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function fetchAdminNotifications(params: {
  page?: number;
  limit?: number;
  read?: "true" | "false";
}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.read) qs.set("read", params.read);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";

  return request(`/api/admin/notifications${suffix}`) as Promise<{
    success: boolean;
    data: AdminNotification[];
    unreadCount: number;
    pagination: { total: number; page: number; limit: number; pages: number };
  }>;
}

export function markAdminNotificationRead(notificationId: string) {
  return request(`/api/admin/notifications/${notificationId}/read`, {
    method: "PATCH",
  }) as Promise<{ success: boolean; message?: string; data: AdminNotification }>;
}

export function markAllAdminNotificationsRead() {
  return request(`/api/admin/notifications/read-all`, {
    method: "PATCH",
  }) as Promise<{ success: boolean; message?: string; data: { updated: number } }>;
}

export function broadcastAdminMessage(payload: {
  message: string;
  target: "all" | "free" | "pro" | "suspended";
}) {
  return request(`/api/admin/notifications/broadcast`, {
    method: "POST",
    body: JSON.stringify(payload),
  }) as Promise<{ success: boolean; message?: string; data: { inserted: number; target: string } }>;
}

