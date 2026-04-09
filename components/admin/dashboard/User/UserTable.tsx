import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Eye, MoreHorizontal, X } from 'lucide-react';
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

function UserDetailsModal({
  user,
  onClose,
}: {
  user: UserManagementRow | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!user) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [user, onClose]);

  if (!user) return null;

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
            <UserAvatar src={user.avatar} name={user.name} />
            <div className="min-w-0">
              <div className="text-base font-semibold text-textBlack truncate">{user.name}</div>
              <div className="text-sm text-textGray truncate">{user.email}</div>
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
            <div className="text-xs text-textGray">Plan</div>
            <div className="mt-1"><UserManagementPlanBadge plan={user.plan} /></div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-xs text-textGray">Status</div>
            <div className="mt-1"><UserManagementStatusBadge status={user.status} /></div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-xs text-textGray">Tasks posted</div>
            <div className="mt-1 text-sm font-medium text-textBlack">{user.tasksPosted}</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-xs text-textGray">Join date</div>
            <div className="mt-1 text-sm font-medium text-textBlack">{user.joinDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [selectedUser, setSelectedUser] = useState<UserManagementRow | null>(null);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="overflow-x-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3.5 px-4 sm:px-6 text-xs font-medium text-textGray w-[48%]">User</th>
              <th className="py-3.5 px-4 sm:px-6 text-xs font-medium text-textGray">Plan</th>
              <th className="py-3.5 px-4 sm:px-6 text-xs font-medium text-textGray">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-xs font-medium text-textGray text-right">View</th>
              <th className="py-3.5 px-4 sm:px-6 text-xs font-medium text-textGray text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <UserAvatar src={user.avatar} name={user.name} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-textBlack truncate">{user.name}</p>
                      <p className="text-xs text-textGray truncate">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 sm:px-6"><UserManagementPlanBadge plan={user.plan} /></td>
                <td className="py-4 px-4 sm:px-6"><UserManagementStatusBadge status={user.status} /></td>
                <td className="py-4 px-4 sm:px-6 text-right">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                    onClick={() => setSelectedUser(user)}
                    title="View details"
                  >
                    <Eye className="w-4 h-4 text-textGray" />
                  </button>
                </td>
                <td className="py-4 px-4 sm:px-6 text-right">
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

      <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}