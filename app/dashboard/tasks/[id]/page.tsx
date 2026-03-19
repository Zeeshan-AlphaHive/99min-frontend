"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TaskDetails, { TaskDetailsData } from "@/components/dashboard/TaskDetails";
import { useAuth } from "@/store/auth-context";
import { request } from "@/utils/api/client";
import type { ApiTask } from "@/utils/api/tasks.api";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";

function formatTimeLeft(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { tr } = useI18n();

  const { data, isLoading, error } = useQuery({
    queryKey: ["task", id],
    queryFn: () => request<{ success: boolean; data: ApiTask }>(`/api/tasks/${id}`),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-orange" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data?.data) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-3">
          <p className="text-red-500">Task not found.</p>
          <button
            onClick={() => router.back()}
            className="text-orange underline text-sm"
          >
            {tr("Go back")}
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const task = data.data;
  const isOwner = task.posterUserId._id === user?._id;

  const mapped: TaskDetailsData & { posterUserId: string } = {
    _id: task._id,
    image: task.media?.[0] ?? "",
    title: task.title,
    description: task.description,
    price:
      task.budget.min === task.budget.max
        ? `${task.budget.min}`
        : `${task.budget.min}-${task.budget.max}`,
    location: task.location.label,
    timeLeft: formatTimeLeft(task.expiresAt),
    interest: task.interestCount ?? 0,
    urgent: task.urgent,
    category: task.category,
    postedTime: `Posted ${timeAgo(task.createdAt)}`,
    tags: task.tags?.map((t) => `#${t}`) ?? [],
    posterUserId: task.posterUserId._id,
  };

  return (
    <DashboardLayout>
      <TaskDetails
        task={mapped}
        onBack={() => router.back()}
        isOwner={isOwner}
        onEdit={() => {
          const params = new URLSearchParams({
            editId:      task._id,
            title:       task.title,
            description: task.description,
            category:    task.category ?? "errands",
            budget:      mapped.price,
            location:    task.location.label,
            tags:        (task.tags ?? []).join(","),
            duration:    "90_mins",
          });
          router.push(`/dashboard/create?${params.toString()}`);
        }}
        onDelete={() => router.push("/dashboard")}
      />
    </DashboardLayout>
  );
}