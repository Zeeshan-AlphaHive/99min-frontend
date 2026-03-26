import React from 'react';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import type { AdminRow } from './types';
import AdminsPagination from './AdminsPagination';

type AdminsTableProps = {
  admins: AdminRow[];
};

export default function AdminsTable({ admins }: AdminsTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-200 bg-white">
            <th className="py-4 px-6 text-xs font-medium text-textGray w-[50%]">Active Administrators</th>
            <th className="py-4 px-6 text-xs font-medium text-textGray">Role</th>
            <th className="py-4 px-6 text-xs font-medium text-textGray">Last Login</th>
            <th className="py-4 px-6 text-xs font-medium text-textGray text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {admins.map((admin) => (
            <tr key={admin.id} className="hover:bg-gray-50 transition-colors group">
              <td className="py-4 px-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-lightGrey shrink-0 relative">
                  <Image src={admin.avatar} alt="Admin Avatar" fill sizes="40px" className="object-cover" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-textBlack truncate">{admin.address}</span>
                  <span className="text-xs text-textGray truncate">{admin.email}</span>
                </div>
              </td>

              <td className="py-4 px-6 text-sm text-textGray">{admin.roleLabel}</td>
              <td className="py-4 px-6 text-sm text-textGray">{admin.lastLogin}</td>

              <td className="py-4 px-6 text-center">
                <button
                  type="button"
                  className="p-1.5 text-textGray hover:text-textBlack hover:bg-gray-100 rounded-md transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AdminsPagination />
    </div>
  );
}
