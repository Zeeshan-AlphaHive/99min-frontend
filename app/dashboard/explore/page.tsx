"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/contexts/i18n-context";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TaskDetails, { TaskDetailsData } from "@/components/dashboard/TaskDetails";
import ShareAdModal from "@/components/dashboard/ShareAdModal";
import ReportAdModal from "@/components/dashboard/ReportAdModal";
import DeleteAdModal from "@/components/dashboard/DeleteAdModal";
import ExploreCategoryTabs from "@/components/dashboard/explore/ExploreCategoryTabs";
import ExplorePromoBanner from "@/components/dashboard/explore/ExplorePromoBanner";
import ExploreCompactCard from "@/components/dashboard/explore/ExploreCompactCard";
import ExploreRecommendedCard from "@/components/dashboard/explore/ExploreRecommendedCard";
import ExploreHorizontalSection from "@/components/dashboard/explore/ExploreHorizontalSection";
import { mapApiTask, type ExploreTask } from "@/components/dashboard/explore/explore-utils";
import { useTasks, useShareTask, useReportTask, useDeleteTask } from "@/hooks/UseTasks";
import { useAuth } from "@/store/auth-context";
import { useSearch } from "@/contexts/search-context";
import { useDebounce } from "@/hooks/UseDebounce";

const ExplorePage: React.FC = () => {
  const router = useRouter();
  const { tr } = useI18n();
  const { query } = useSearch();
  const debouncedQuery = useDebounce(query, 400);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTask, setSelectedTask] = useState<ExploreTask | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const { user } = useAuth();
  const currentUserId = user?._id ?? "";

  const listParams = {
    status: "active" as const,
    q: debouncedQuery || undefined,
    category: selectedCategory || undefined,
    limit: 20,
  };

  const {
    data: newestData,
    isLoading: newestLoading,
    error: newestError,
    refetch,
  } = useTasks({ ...listParams, sort: "newest" });

  const {
    data: popularData,
    isLoading: popularLoading,
  } = useTasks({ ...listParams, sort: "popular" });

  const galerieTasks: ExploreTask[] = (newestData?.data ?? []).map(mapApiTask);
  const recommendedTasks: ExploreTask[] = (popularData?.data ?? []).map(mapApiTask);
  const isSearchMode = !!debouncedQuery;
  const isLoading = newestLoading || popularLoading;
  const error = newestError;

  const { mutate: recordShare } = useShareTask();
  const { mutateAsync: submitReport } = useReportTask(activeTaskId ?? "");
  const { mutateAsync: deleteTask } = useDeleteTask();

  const handleTaskClick = (task: ExploreTask) => setSelectedTask(task);
  const handleBack = () => setSelectedTask(null);

  const handleShare = (taskId: string) => {
    setActiveTaskId(taskId);
    setIsShareModalOpen(true);
    recordShare(taskId);
  };

  const handleReport = (taskId: string) => {
    setActiveTaskId(taskId);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async (reason: string, details: string) => {
    try {
      await submitReport({
        reason: reason as "spam" | "inappropriate" | "scam" | "duplicate" | "other",
        details,
      });
      setIsReportModalOpen(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : tr("Something went wrong"));
    }
  };

  const handleEdit = (task: ExploreTask) => {
    const params = new URLSearchParams({
      editId: task._id,
      title: task.title,
      description: task.description,
      category: task.category ?? "errands",
      budget: task.price,
      location: task.location,
      tags: (task.tags ?? []).map((tag) => tag.replace(/^#/, "")).join(","),
      duration: "90_mins",
    });
    router.push(`/dashboard/create?${params.toString()}`);
  };

  const handleDeleteRequest = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete);
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      if (selectedTask?._id === taskToDelete) setSelectedTask(null);
      refetch();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : tr("Something went wrong"));
    }
  };

  if (selectedTask) {
    const isOwner = selectedTask.createdBy === currentUserId;
    return (
      <DashboardLayout>
        <TaskDetails
          task={selectedTask as TaskDetailsData}
          onBack={handleBack}
          isOwner={isOwner}
          onEdit={() => handleEdit(selectedTask)}
          onDelete={() => handleDeleteRequest(selectedTask._id)}
        />
        <DeleteAdModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      </DashboardLayout>
    );
  }

  const emptyMessage = debouncedQuery
    ? `No tasks found for "${debouncedQuery}"`
    : tr("No tasks found");

  return (
    <DashboardLayout>
      <div className="bg-inputBg min-h-screen pb-8">
        <div className="max-w-6xl mx-auto px-4 pt-4 space-y-5">

          {/* Category tabs */}
          <ExploreCategoryTabs
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />

          {/* Promo banner — hidden during search */}
          {!isSearchMode && <ExplorePromoBanner />}

          {/* Loading */}
          {isLoading && (
            <p className="text-center text-textGray py-8">
              {debouncedQuery
                ? `Searching for "${debouncedQuery}"...`
                : tr("Loading tasks...")}
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-center text-red-500 py-8">
              {error instanceof Error ? error.message : tr("Failed to load tasks")}
            </p>
          )}

          {!isLoading && !error && (
            <>
              {/* Search results — vertical grid */}
              {isSearchMode ? (
                <section>
                  <h2 className="text-base font-bold text-textBlack mb-3">
                    {tr("Search results")}
                  </h2>
                  {galerieTasks.length === 0 ? (
                    <p className="text-sm text-textGray text-center py-8">{emptyMessage}</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {galerieTasks.map((task) => (
                        <ExploreRecommendedCard
                          key={task._id}
                          image={task.image}
                          title={task.title}
                          price={task.price}
                          interest={task.interest}
                          urgent={task.urgent}
                          fullWidth
                          onClick={() => handleTaskClick(task)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              ) : (
                <>
                  {/* Galerie — newest tasks */}
                  <ExploreHorizontalSection
                    title={tr("Gallery")}
                    isEmpty={galerieTasks.length === 0}
                    emptyMessage={emptyMessage}
                  >
                    {galerieTasks.map((task) => (
                      <ExploreCompactCard
                        key={task._id}
                        image={task.image}
                        title={task.title}
                        price={task.price}
                        onClick={() => handleTaskClick(task)}
                      />
                    ))}
                  </ExploreHorizontalSection>

                  {/* Recommended — popular tasks */}
                  <ExploreHorizontalSection
                    title={tr("Recommended for you")}
                    isEmpty={recommendedTasks.length === 0}
                  >
                    {recommendedTasks.map((task) => (
                      <ExploreRecommendedCard
                        key={task._id}
                        image={task.image}
                        title={task.title}
                        price={task.price}
                        interest={task.interest}
                        urgent={task.urgent}
                        onClick={() => handleTaskClick(task)}
                      />
                    ))}
                  </ExploreHorizontalSection>
                </>
              )}
            </>
          )}
        </div>

        <ShareAdModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onShare={(platform) => console.log("Shared on:", platform)}
        />
        <ReportAdModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleReportSubmit}
        />
        <DeleteAdModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </DashboardLayout>
  );
};

export default ExplorePage;
