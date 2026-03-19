"use client";

import React from 'react';
import { UserX, X } from 'lucide-react';
import SettingsSection from './SettingsSection';
import { useBlockedUsers } from '@/hooks/UseBlockedUser';
import { useI18n } from '@/contexts/i18n-context';

const BlockedUsersSection: React.FC = () => {
  const { tr } = useI18n();
  const { blockedUsers, loading, error, handleUnblock } = useBlockedUsers();

  return (
    <SettingsSection title="BLOCKED USERS">
      {/* Loading */}
      {loading && (
        <div className="px-4 py-4 space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 h-4 bg-gray-200 rounded w-1/3" />
              <div className="w-16 h-8 bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="px-4 py-3 text-red-500 text-sm">{tr(error)}</div>
      )}

      {/* Empty state */}
      {!loading && !error && blockedUsers.length === 0 && (
        <div className="px-4 bg-inputBg py-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
              <UserX className="w-8 h-8 text-textGray" />
            </div>
            <p className="text-textGray text-sm">{tr('No blocked users')}</p>
          </div>
        </div>
      )}

      {/* Blocked users list */}
      {!loading && blockedUsers.length > 0 && (
        <div className="divide-y divide-gray-100">
          {blockedUsers.map((item) => (
            <div key={item._id} className="flex items-center gap-3 px-4 py-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-orange flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">
                  {item.blockedId.name?.charAt(0).toUpperCase() ?? "?"}
                </span>
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="text-textBlack font-semibold text-sm truncate">
                  {item.blockedId.name}
                </p>
                {item.blockedId.username && (
                  <p className="text-textGray text-xs truncate">
                    @{item.blockedId.username}
                  </p>
                )}
              </div>

              {/* Unblock button */}
              <button
                onClick={() => handleUnblock(item.blockedId._id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-textGray hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors shrink-0"
              >
                <X className="w-3 h-3" />
                {tr('Unblock')}
              </button>
            </div>
          ))}
        </div>
      )}
    </SettingsSection>
  );
};

export default BlockedUsersSection;