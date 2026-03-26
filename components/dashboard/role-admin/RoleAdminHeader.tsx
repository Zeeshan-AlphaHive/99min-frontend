import React from 'react';
import { UserPlus } from 'lucide-react';

type RoleAdminHeaderProps = {
  onOpenCreateAdminModal: () => void;
};

export default function RoleAdminHeader({ onOpenCreateAdminModal }: RoleAdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-textBlack mb-1">Admins & Permissions</h1>
        <p className="text-sm text-textGray">Control who has access to the administrative dashboard.</p>
      </div>

      <button
        type="button"
        onClick={onOpenCreateAdminModal}
        className="flex items-center gap-2 px-4 py-2.5 bg-orange hover:bg-orangeHover text-white text-sm font-medium rounded-lg transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        Add Admin
      </button>
    </div>
  );
}
