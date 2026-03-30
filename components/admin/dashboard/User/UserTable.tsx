import React from 'react';
import Image from 'next/image';
import type { UserManagementRow } from './types';
import UserManagementPlanBadge from './UserPlanBadge';
import UserManagementStatusBadge from './UserStatusBadge';

type UserManagementTableProps = {
  users: UserManagementRow[];
};

export default function UserManagementTable({ users }: UserManagementTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
      <table className="w-full text-left border-collapse min-w-[700px]">
        {/* Head */}
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-3.5 px-6 text-xs font-medium text-textGray w-[32%]">User</th>
            <th className="py-3.5 px-6 text-xs font-medium text-textGray">Plan</th>
            <th className="py-3.5 px-6 text-xs font-medium text-textGray">Tasks Posted</th>
            <th className="py-3.5 px-6 text-xs font-medium text-textGray">Status</th>
            <th className="py-3.5 px-6 text-xs font-medium text-textGray">Join Date</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              {/* User */}
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0 relative">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-textBlack truncate">{user.name}</p>
                    <p className="text-xs text-textGray truncate">{user.email}</p>
                  </div>
                </div>
              </td>

              {/* Plan */}
              <td className="py-4 px-6">
                <UserManagementPlanBadge plan={user.plan} />
              </td>

              {/* Tasks Posted */}
              <td className="py-4 px-6 text-sm text-textBlack font-medium">
                {user.tasksPosted}
              </td>

              {/* Status */}
              <td className="py-4 px-6">
                <UserManagementStatusBadge status={user.status} />
              </td>

              {/* Join Date */}
              <td className="py-4 px-6 text-sm text-textGray">{user.joinDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}