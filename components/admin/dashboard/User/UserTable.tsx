import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import type { UserManagementRow } from './types';
import UserManagementPlanBadge from './UserPlanBadge';
import UserManagementStatusBadge from './UserStatusBadge';
import DataTablePagination from '../Shared/DataTablePagination';

type UserManagementTableProps = {
  users: UserManagementRow[];
  totalResults?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onAction?: (userId: string, action: 'active' | 'suspend') => void;
};

function UserAvatar({ src, name }: { src: string; name: string }) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
        <span className="text-sm font-medium text-gray-500">
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 shrink-0 relative">
      <Image
        src={src}
        alt={name}
        fill
        sizes="36px"
        className="object-cover"
        onError={() => setErrored(true)}
      />
    </div>
  );
}

function ActionDropdown({
  userId,
  onAction,
}: {
  userId: string;
  onAction?: (userId: string, action: 'active' | 'suspend') => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4 text-textGray" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
          <button
            className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-50 transition-colors"
            onClick={() => { onAction?.(userId, 'active'); setOpen(false); }}
          >
            Active
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors"
            onClick={() => { onAction?.(userId, 'suspend'); setOpen(false); }}
          >
            Suspend
          </button>
        </div>
      )}
    </div>
  );
}

export default function UserManagementTable({
  users,
  totalResults,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onAction,
}: UserManagementTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3.5 px-6 text-xs font-medium text-textGray w-[32%]">User</th>
              <th className="py-3.5 px-6 text-xs font-medium text-textGray">Plan</th>
              <th className="py-3.5 px-6 text-xs font-medium text-textGray">Tasks Posted</th>
              <th className="py-3.5 px-6 text-xs font-medium text-textGray">Status</th>
              <th className="py-3.5 px-6 text-xs font-medium text-textGray">Join Date</th>
              <th className="py-3.5 px-6 text-xs font-medium text-textGray">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <UserAvatar src={user.avatar} name={user.name} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-textBlack truncate">{user.name}</p>
                      <p className="text-xs text-textGray truncate">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6"><UserManagementPlanBadge plan={user.plan} /></td>
                <td className="py-4 px-6 text-sm text-textBlack font-medium">{user.tasksPosted}</td>
                <td className="py-4 px-6"><UserManagementStatusBadge status={user.status} /></td>
                <td className="py-4 px-6 text-sm text-textGray">{user.joinDate}</td>
                <td className="py-4 px-6">
                  <ActionDropdown userId={user.id} onAction={onAction} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DataTablePagination
        totalResults={totalResults ?? users.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}