'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, MapPin, Trash2, X } from 'lucide-react';
import type { TaskRow } from './types';
import AllTaskStatusBadge from './AllTaskStatusBadge';
import AllTaskInterestBadge from './AllTasksInterestBadge';
import AllTaskRemainingCell from './AllTaskCell';
import DataTablePagination from '../Shared/DataTablePagination';
import ConfirmationModal from '@/components/shared/ConfirmationModal';
import { useRemoveTask } from '@/hooks/UseAdminModeration';

type AllTaskTableProps = {
  tasks: TaskRow[];
  totalResults?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

function TaskDetailsModal({
  task,
  onClose,
}: {
  task: TaskRow | null;
  onClose: () => void;
}) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl border border-gray-200 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <TaskAvatar src={task.avatar} title={task.title} />
            <div className="min-w-0">
              <div className="text-base font-semibold text-textBlack truncate">{task.title}</div>
              <div className="text-sm text-textGray line-clamp-2">{task.description}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-50 border border-gray-200"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-textGray" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-xs text-textGray">Budget</div>
            <div className="mt-1 text-sm font-medium text-textBlack">{task.budget}</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-xs text-textGray">Location</div>
            <div className="mt-1 text-sm font-medium text-textBlack">{task.location}</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-xs text-textGray">Remaining</div>
            <div className="mt-1">
              <AllTaskRemainingCell remaining={task.remaining} expired={task.remainingExpired} />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-xs text-textGray">Interest</div>
            <div className="mt-1"><AllTaskInterestBadge count={task.interested} /></div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 sm:col-span-2">
            <div className="text-xs text-textGray">Status</div>
            <div className="mt-1"><AllTaskStatusBadge status={task.status} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskAvatar({ src, title }: { src: string; title: string }) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
        <span className="text-sm font-medium text-gray-500">
          {title.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 shrink-0 relative">
      <Image
        src={src}
        alt={title}
        fill
        sizes="36px"
        className="object-cover"
        onError={() => setErrored(true)}
      />
    </div>
  );
}

export default function AllTaskTable({
  tasks,
  totalResults,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: AllTaskTableProps) {
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null);
  const [deleteTask, setDeleteTask] = useState<TaskRow | null>(null);
  const { mutateAsync: remove, isPending: removing } = useRemoveTask();

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="overflow-x-hidden">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3.5 px-4 sm:px-6 text-xs font-medium text-textGray w-[55%]">Task</th>
              <th className="py-3.5 px-4 sm:px-6 text-xs font-medium text-textGray hidden md:table-cell">Budget</th>
              <th className="py-3.5 px-4 sm:px-6 text-xs font-medium text-textGray hidden lg:table-cell">Location</th>
              <th className="py-3.5 px-4 sm:px-6 text-xs font-medium text-textGray hidden md:table-cell">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-xs font-medium text-textGray text-right">View</th>
              <th className="py-3.5 px-4 sm:px-6 text-xs font-medium text-textGray text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <TaskAvatar src={task.avatar} title={task.title} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-textBlack truncate">{task.title}</p>
                      <p className="hidden sm:block text-xs text-textGray line-clamp-1">
                        {task.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 sm:px-6 text-sm font-medium text-textBlack hidden md:table-cell">{task.budget}</td>
                <td className="py-4 px-4 sm:px-6 hidden lg:table-cell">
                  <span className="flex items-center gap-1 text-sm text-textGray">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {task.location}
                  </span>
                </td>
                <td className="py-4 px-4 sm:px-6 hidden md:table-cell"><AllTaskStatusBadge status={task.status} /></td>
                <td className="py-4 px-4 sm:px-6 text-right">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                    onClick={() => setSelectedTask(task)}
                    title="View details"
                  >
                    <Eye className="w-4 h-4 text-textGray" />
                  </button>
                </td>
                <td className="py-4 px-4 sm:px-6 text-right">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200"
                    onClick={() => setDeleteTask(task)}
                    title="Delete task"
                    disabled={task.status === 'Removed'}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DataTablePagination
        totalResults={totalResults ?? tasks.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />

      <ConfirmationModal
        isOpen={!!deleteTask}
        onClose={() => setDeleteTask(null)}
        title="Delete task?"
        description="This will remove the task from the platform. The task owner will be notified."
        confirmText={removing ? "Deleting…" : "Delete"}
        cancelText="Cancel"
        onConfirm={() => {
          if (!deleteTask) return;
          return remove({ taskId: deleteTask.id, reason: "Removed by admin" })
            .catch(() => {})
            .finally(() => setDeleteTask(null));
        }}
      />
    </div>
  );
}