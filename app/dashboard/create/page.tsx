"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CreateTaskHeader from "@/components/create/CreateTaskHeader";
import CreateTaskForm, { FormData } from "@/components/create/CreateTaskForm";
import { useCreateTask, useUpdateTask, useUploadMedia } from "@/hooks/UseTasks";
import { useI18n } from "@/contexts/i18n-context";

const CreateTaskPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tr } = useI18n();

  // ─── Edit mode: read prefilled data from URL search params ────────────────
  // ExplorePage encodes the task fields into the URL when navigating here.
  const editTaskId = searchParams.get("editId");
  const isEditMode = !!editTaskId;

  const initialData: Partial<FormData> | undefined = isEditMode
    ? {
        title:       searchParams.get("title")       ?? "",
        description: searchParams.get("description") ?? "",
        category:    searchParams.get("category")    ?? "errands",
        budget:      searchParams.get("budget")      ?? "",
        location:    searchParams.get("location")    ?? "",
        tags:        searchParams.get("tags")        ?? "",
        duration:   (searchParams.get("duration")    ?? "90_mins") as FormData["duration"],
      }
    : undefined;

  // ─── Mutations ──────────────────────────────────────────────────────────────
  const { mutateAsync: upload, isPending: uploading } = useUploadMedia();
  const { mutateAsync: create, isPending: creating, error: createError } = useCreateTask();
  const { mutateAsync: update, isPending: updating, error: updateError } = useUpdateTask(editTaskId ?? "");

  const error = createError ?? updateError;
  const isPending = uploading || creating || updating;

  // ─── Submit handler ─────────────────────────────────────────────────────────
  const handleSubmit = async (data: FormData, files: File[]) => {
    // 1. Upload new files if provided
    let mediaUrls: string[] = [];
    if (files.length > 0) {
      mediaUrls = await upload(files);
    }

    // 2. Parse budget
    let budgetMin: number;
    let budgetMax: number;

    if (data.budget.includes("-")) {
      const [min, max] = data.budget.split("-").map((v) => Number(v.trim()));
      budgetMin = min;
      budgetMax = max;
    } else {
      budgetMin = Number(data.budget);
      budgetMax = Number(data.budget);
    }

    // 3. Parse tags
    const tags = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title:       data.title,
      description: data.description,
      category:    data.category,
      budget:      { min: budgetMin, max: budgetMax },
      location:    { label: data.location },
      duration:    data.duration,
      urgent:      data.urgent ?? false,
      tags,
      // Only include media if new files were uploaded
      ...(mediaUrls.length > 0 ? { media: mediaUrls } : {}),
    };

    if (isEditMode) {
      await update(payload);
    } else {
      await create({ ...payload, media: mediaUrls });
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-inputBg">
        <CreateTaskHeader />

        {error && (
          <p className="text-red-500 text-sm text-center py-2">
            {error instanceof Error ? error.message : tr("Something went wrong")}
          </p>
        )}

        {isPending && (
          <p className="text-textGray text-sm text-center py-2">
            {uploading
              ? tr("Uploading media…")
              : isEditMode
                ? tr("Updating task…")
                : tr("Creating task…")}
          </p>
        )}

        <div className="max-w-4xl mx-auto">
          <CreateTaskForm
            onSubmit={handleSubmit}
            initialData={initialData}
            isEditMode={isEditMode}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTaskPage;