import { request } from "@/utils/api/client";

export type AdminUserReportStatus = "pending" | "reviewing" | "resolved" | "dismissed";
export type AdminUserReportAction = "none" | "warned" | "suspended" | "banned";
export type AdminTaskReportAction = "none" | "warned" | "suspended" | "banned" | "task_removed";

export interface AdminReportUserLite {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  status?: string;
  role?: string;
}

export interface AdminUserReport {
  _id: string;
  reportedUserId: AdminReportUserLite;
  reporterUserId: AdminReportUserLite;
  reason: string;
  details?: string;
  status: AdminUserReportStatus;
  actionTaken: AdminUserReportAction;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTaskLite {
  _id: string;
  title: string;
  status?: string;
  createdAt?: string;
  posterUserId?: AdminReportUserLite;
}

export interface AdminTaskReport {
  _id: string;
  taskId: AdminTaskLite;
  reporterUserId: AdminReportUserLite;
  reason: string;
  details?: string;
  status: AdminUserReportStatus;
  actionTaken: AdminTaskReportAction;
  createdAt: string;
  updatedAt: string;
}

export function fetchUserReports(params: {
  page?: number;
  limit?: number;
  status?: AdminUserReportStatus | "all";
  q?: string;
}): Promise<{ success: boolean; page: number; limit: number; total: number; data: AdminUserReport[] }> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.status) qs.set("status", params.status);
  if (params.q) qs.set("q", params.q);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return request(`/api/admin/reports/users${suffix}`) as Promise<{
    success: boolean;
    page: number;
    limit: number;
    total: number;
    data: AdminUserReport[];
  }>;
}

export function updateUserReport(
  reportId: string,
  payload: Partial<{ status: AdminUserReportStatus; actionTaken: AdminUserReportAction; resolutionNote: string }>
): Promise<{ success: boolean; message?: string; data: AdminUserReport }> {
  return request(`/api/admin/reports/users/${reportId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }) as Promise<{ success: boolean; message?: string; data: AdminUserReport }>;
}

export function fetchTaskReports(params: {
  page?: number;
  limit?: number;
  status?: AdminUserReportStatus | "all";
  q?: string;
}): Promise<{ success: boolean; page: number; limit: number; total: number; data: AdminTaskReport[] }> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.status) qs.set("status", params.status);
  if (params.q) qs.set("q", params.q);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return request(`/api/admin/reports/tasks${suffix}`) as Promise<{
    success: boolean;
    page: number;
    limit: number;
    total: number;
    data: AdminTaskReport[];
  }>;
}

