"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CreateTaskHeader from "@/components/create/CreateTaskHeader";
import CreateTaskForm, { FormData } from "@/components/create/CreateTaskForm";
import { useCreateTask, useUpdateTask, useUploadMedia } from "@/hooks/UseTasks";
import { useI18n } from "@/contexts/i18n-context";
import { useAuth } from "@/store/auth-context";

const CreateTaskPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tr } = useI18n();
  const { user } = useAuth();

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
  const isBanned = user?.status === "banned";
  const banMessage = tr("Your account has been banned. You can't create new tasks.");

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
      const idempotencyKey =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      await create({ payload: { ...payload, media: mediaUrls }, idempotencyKey });
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-inputBg">
        <CreateTaskHeader />

        {isBanned && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-6 sm:p-8 text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-textBlack">
                {tr("Account banned")}
              </h2>
              <p className="text-sm sm:text-base text-textGray mt-3">
                {banMessage}
              </p>
              <button
                type="button"
                onClick={() => router.push("/dashboard/explore")}
                className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-orange text-white font-semibold hover:opacity-90 transition"
              >
                {tr("Back to Explore")}
              </button>
            </div>
          </div>
        )}

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

        {!isBanned && (
          <div className="max-w-4xl mx-auto">
            <CreateTaskForm
              onSubmit={handleSubmit}
              initialData={initialData}
              isEditMode={isEditMode}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateTaskPage;