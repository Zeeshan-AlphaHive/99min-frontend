import { request } from "@/utils/api/client";

export type ReportUserPayload = {
  reason: string;
  details?: string;
};

export function reportUser(
  userId: string,
  payload: ReportUserPayload
): Promise<{ success: boolean; message?: string; data: unknown }> {
  return request(`/api/users/${userId}/report`, {
    method: "POST",
    body: JSON.stringify(payload),
  }) as Promise<{ success: boolean; message?: string; data: unknown }>;
}

