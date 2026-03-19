"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ExploreHeader from "@/components/dashboard/ExploreHeader";
import TaskCard from "@/components/dashboard/TaskCard";
import PinnedTaskCard from "@/components/dashboard/PinnedTaskCard";
import TaskDetails, { TaskDetailsData } from "@/components/dashboard/TaskDetails";
import ShareAdModal from "@/components/dashboard/ShareAdModal";
import ReportAdModal from "@/components/dashboard/ReportAdModal";
import DeleteAdModal from "@/components/dashboard/DeleteAdModal";
import { useTasks, useShareTask, useReportTask, useDeleteTask } from "@/hooks/UseTasks";
import { useAuth } from "@/store/auth-context";
import type { ApiTask } from "@/utils/api/tasks.api";

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
interface TaskWithOwner extends TaskDetailsData { createdBy: string; posterUserId: string; }
function mapApiTask(task: ApiTask): TaskWithOwner {
  return {
    _id: task._id, image: task.media?.[0] ?? "", title: task.title, description: task.description,
    price: task.budget.min === task.budget.max ? `${task.budget.min}` : `${task.budget.min}-${task.budget.max}`,
    location: task.location.label, timeLeft: formatTimeLeft(task.expiresAt),
    interest: task.interestCount ?? 0, urgent: task.urgent, category: task.category,
    postedTime: `Posted ${timeAgo(task.createdAt)}`, tags: task.tags?.map((t) => `#${t}`) ?? [],
    createdBy: task.posterUserId._id, posterUserId: task.posterUserId._id,
  };
}

const ExplorePage: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();
  const [selectedTask, setSelectedTask] = useState<TaskWithOwner | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const { user } = useAuth();
  const currentUserId = user?._id ?? "";
  const { data, isLoading, error, refetch } = useTasks({ status: "active", sort: "newest" });
  const tasks: TaskWithOwner[] = (data?.data ?? []).map(mapApiTask);
  const { mutate: recordShare } = useShareTask();
  const { mutateAsync: submitReport } = useReportTask(activeTaskId ?? "");
  const { mutateAsync: deleteTask } = useDeleteTask();
  const handleTaskClick = (task: TaskWithOwner) => setSelectedTask(task);
  const handleBack = () => setSelectedTask(null);
  const handleShare = (taskId: string) => { setActiveTaskId(taskId); setIsShareModalOpen(true); recordShare(taskId); };
  const handleReport = (taskId: string) => { setActiveTaskId(taskId); setIsReportModalOpen(true); };
  const handleReportSubmit = async (reason: string, details: string) => {
    try {
      await submitReport({ reason: reason as "spam" | "inappropriate" | "scam" | "duplicate" | "other", details });
      setIsReportModalOpen(false);
    } catch (err: unknown) { alert(err instanceof Error ? err.message : t("common.error")); }
  };
  const handleEdit = (task: TaskWithOwner) => {
    const params = new URLSearchParams({ editId: task._id, title: task.title, description: task.description,
      category: task.category ?? "errands", budget: task.price, location: task.location,
      tags: (task.tags ?? []).map((t) => t.replace(/^#/, "")).join(","), duration: "90_mins" });
    router.push(`/dashboard/create?${params.toString()}`);
  };
  const handleDeleteRequest = (taskId: string) => { setTaskToDelete(taskId); setIsDeleteModalOpen(true); };
  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete); setIsDeleteModalOpen(false); setTaskToDelete(null);
      if (selectedTask?._id === taskToDelete) setSelectedTask(null);
      refetch();
    } catch (err: unknown) { alert(err instanceof Error ? err.message : t("common.error")); }
  };

  if (selectedTask) {
    const isOwner = selectedTask.createdBy === currentUserId;
    return (
      <DashboardLayout>
        <TaskDetails task={selectedTask} onBack={handleBack} isOwner={isOwner}
          onEdit={() => handleEdit(selectedTask)} onDelete={() => handleDeleteRequest(selectedTask._id)} />
        <DeleteAdModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setTaskToDelete(null); }} onConfirm={handleDeleteConfirm} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-inputBg p-6">
        <div className="max-w-6xl mx-auto">
          <ExploreHeader activeTasksCount={tasks.length} />
          {isLoading && <p className="text-center text-textGray py-12">{t("task.loadingTasks")}</p>}
          {error && <p className="text-center text-red-500 py-12">{error instanceof Error ? error.message : t("task.failedLoad")}</p>}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <PinnedTaskCard />
              {tasks.length === 0 ? (
                <p className="text-textGray text-center col-span-2 py-12">{t("task.noTasksFound")}</p>
              ) : (
                tasks.map((task) => (
                  <TaskCard key={task._id} {...task} isOwner={task.createdBy === currentUserId}
                    posterUserId={task.posterUserId} taskId={task._id}
                    onClick={() => handleTaskClick(task)} onShare={() => handleShare(task._id)}
                    onReport={() => handleReport(task._id)} onEdit={() => handleEdit(task)}
                    onDelete={() => handleDeleteRequest(task._id)} />
                ))
              )}
            </div>
          )}
        </div>
        <ShareAdModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} onShare={(platform) => console.log("Shared on:", platform)} />
        <ReportAdModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} onSubmit={handleReportSubmit} />
        <DeleteAdModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setTaskToDelete(null); }} onConfirm={handleDeleteConfirm} />
      </div>
    </DashboardLayout>
  );
};
export default ExplorePage;