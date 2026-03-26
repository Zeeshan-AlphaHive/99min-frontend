'use client';

import React, { useEffect, useId, useState } from 'react';
import { X } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AdminRole } from './types';

type CreateAdminModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateAdminModal({ isOpen, onClose }: CreateAdminModalProps) {
  const titleId = useId();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('admin');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    setFullName('');
    setEmail('');
    setRole('admin');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Minimal behavior for now: close on submit.
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <h2 id={titleId} className="text-base font-bold text-textBlack">
            Create New Admin
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-textGray" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <Input
            label="Full Name"
            placeholder="Enter full name..."
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <Input
            label="Email Address"
            placeholder="admin@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="mb-5">
            <label className="block text-textBlack text-sm font-bold mb-2 ml-1">Administrative Role</label>
            <Select value={role} onValueChange={(v) => setRole(v as AdminRole)}>
              <SelectTrigger className="w-full h-12 rounded-xl border border-gray-200 bg-inputBg text-textBlack">
                <SelectValue placeholder="Admin" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" size="sm" onClick={onClose} className="bg-inputBg text-textBlack hover:opacity-90">
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmit} className="bg-orange hover:bg-orangeHover">
              Create Admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
