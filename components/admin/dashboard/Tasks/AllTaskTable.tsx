'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import type { TaskRow } from './types';
import AllTaskStatusBadge from './AllTaskStatusBadge';
import AllTaskInterestBadge from './AllTasksInterestBadge';
import AllTaskRemainingCell from './AllTaskCell';
import DataTablePagination from '../Shared/DataTablePagination';

type AllTaskTableProps = {
  tasks: TaskRow[];
  totalResults?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

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
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3.5 px-6 text-xs font-medium text-textGray w-[28%]">Task</th>
              <th className="py-3.5 px-6 text-xs font-medium text-textGray">Budget</th>
              <th className="py-3.5 px-6 text-xs font-medium text-textGray">Location</th>
              <th className="py-3.5 px-6 text-xs font-medium text-textGray">Remaining</th>
              <th className="py-3.5 px-6 text-xs font-medium text-textGray">Interest</th>
              <th className="py-3.5 px-6 text-xs font-medium text-textGray">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <TaskAvatar src={task.avatar} title={task.title} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-textBlack truncate">{task.title}</p>
                      <p className="text-xs text-textGray truncate">{task.description}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm font-medium text-textBlack">{task.budget}</td>
                <td className="py-4 px-6">
                  <span className="flex items-center gap-1 text-sm text-textGray">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {task.location}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <AllTaskRemainingCell remaining={task.remaining} expired={task.remainingExpired} />
                </td>
                <td className="py-4 px-6"><AllTaskInterestBadge count={task.interested} /></td>
                <td className="py-4 px-6"><AllTaskStatusBadge status={task.status} /></td>
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
    </div>
  );
}