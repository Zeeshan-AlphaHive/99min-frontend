import { request } from "@/utils/api/client";

export type AppSetting = {
  _id: string;
  defaultTaskDuration: number;
  maxDurationPro: number;
  dailyTaskLimitFree: number;
  reportAutoFlagCount: number;
  maintenanceMode: boolean;
  pinnedExampleTask: {
    title: string;
    location: string;
    description: string;
    budget: number;
  };
};

export function getAdminSettings() {
  return request(`/api/admin/settings`) as Promise<{ success: boolean; data: AppSetting }>;
}

export function updateAdminSettings(patch: Partial<AppSetting>) {
  return request(`/api/admin/settings`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  }) as Promise<{ success: boolean; message?: string; data: AppSetting }>;
}

