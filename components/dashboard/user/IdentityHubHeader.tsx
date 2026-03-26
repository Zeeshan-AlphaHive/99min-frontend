import React from 'react';
import { Plus } from 'lucide-react';

type IdentityHubHeaderProps = {
  onOpenOnboardModal: () => void;
};

export default function IdentityHubHeader({ onOpenOnboardModal }: IdentityHubHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-textBlack mb-1">Identity Hub</h1>
        <p className="text-sm text-textGray">System-wide user directory and access control.</p>
      </div>

      <button
        type="button"
        onClick={onOpenOnboardModal}
        className="flex items-center gap-2 px-4 py-2.5 bg-orange hover:bg-orangeHover text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Onboard New User
      </button>
    </div>
  );
}
