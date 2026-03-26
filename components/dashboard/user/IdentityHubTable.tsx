import React from 'react';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import type { IdentityHubUser } from './types';
import IdentityHubPagination from './IdentityHubPagination';

type IdentityHubTableProps = {
  users: IdentityHubUser[];
};

export default function IdentityHubTable({ users }: IdentityHubTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-200 bg-white">
            <th className="py-4 px-6 text-xs font-medium text-textGray w-[40%]">Verified Identity</th>
            <th className="py-4 px-6 text-xs font-medium text-textGray">Account Level</th>
            <th className="py-4 px-6 text-xs font-medium text-textGray">Current Status</th>
            <th className="py-4 px-6 text-xs font-medium text-textGray">Onboarded</th>
            <th className="py-4 px-6 text-xs font-medium text-textGray text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
              <td className="py-4 px-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-lightGrey shrink-0 relative">
                  <Image src={user.avatar} alt="User Avatar" fill sizes="40px" className="object-cover" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-textBlack truncate">{user.address}</span>
                  <span className="text-xs text-textGray truncate">{user.email}</span>
                </div>
              </td>

              <td className="py-4 px-6 text-sm text-textGray">{user.accountLevel}</td>

              <td className="py-4 px-6">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-lightGreen text-green">
                  {user.status}
                </span>
              </td>

              <td className="py-4 px-6 text-sm text-textGray">{user.onboarded}</td>

              <td className="py-4 px-6 text-center">
                <button type="button" className="p-1.5 text-textGray hover:text-textBlack hover:bg-gray-100 rounded-md transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <IdentityHubPagination />
    </div>
  );
}
