import React from 'react';
import Image from 'next/image';

type UserCellProps = {
  avatar: string;
  name: string;
  email: string;
};

export default function UserCell({ avatar, name, email }: UserCellProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0 relative">
        <Image src={avatar} alt={name} fill sizes="36px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-textBlack truncate">{name}</p>
        <p className="text-xs text-textGray truncate">{email}</p>
      </div>
    </div>
  );
}