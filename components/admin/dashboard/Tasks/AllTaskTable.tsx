import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import type { TaskRow } from './types';
import AllTaskStatusBadge from './AllTaskStatusBadge';
import AllTaskInterestBadge from './AllTasksInterestBadge';
import AllTaskRemainingCell from './AllTaskCell';

type AllTaskTableProps = {
  tasks: TaskRow[];
};

export default function AllTaskTable({ tasks }: AllTaskTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
      <table className="w-full text-left border-collapse min-w-[800px]">
        {/* Head */}
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

        {/* Body */}
        <tbody className="divide-y divide-gray-100">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50 transition-colors">
              {/* Task */}
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0 relative">
                    <Image
                      src={task.avatar}
                      alt={task.title}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-textBlack truncate">{task.title}</p>
                    <p className="text-xs text-textGray truncate">{task.description}</p>
                  </div>
                </div>
              </td>

              {/* Budget */}
              <td className="py-4 px-6 text-sm font-medium text-textBlack">{task.budget}</td>

              {/* Location */}
              <td className="py-4 px-6">
                <span className="flex items-center gap-1 text-sm text-textGray">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {task.location}
                </span>
              </td>

              {/* Remaining */}
              <td className="py-4 px-6">
                <AllTaskRemainingCell
                  remaining={task.remaining}
                  expired={task.remainingExpired}
                />
              </td>

              {/* Interest */}
              <td className="py-4 px-6">
                <AllTaskInterestBadge count={task.interested} />
              </td>

              {/* Status */}
              <td className="py-4 px-6">
                <AllTaskStatusBadge status={task.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}