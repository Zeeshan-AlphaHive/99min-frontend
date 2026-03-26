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

type OnboardIdentityModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AccessLevel = 'standard' | 'admin' | 'super_admin';

type InitialStatus = 'active' | 'pending' | 'disabled';

export default function OnboardIdentityModal({ isOpen, onClose }: OnboardIdentityModalProps) {
  const titleId = useId();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('standard');
  const [initialStatus, setInitialStatus] = useState<InitialStatus>('active');

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
    setAccessLevel('standard');
    setInitialStatus('active');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Hook this up to a real API later.
    // Keeping behavior minimal: close after submit.
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
            Onboard Identity
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
            label="Full Legal Name"
            placeholder="e.g. Stephen Strange"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <Input
            label="E-Mail Endpoint"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-textBlack text-sm font-bold mb-2 ml-1">Access Level</label>
              <Select value={accessLevel} onValueChange={(v) => setAccessLevel(v as AccessLevel)}>
                <SelectTrigger className="w-full h-12 rounded-xl border border-gray-200 bg-inputBg text-textBlack">
                  <SelectValue placeholder="Standard" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-textBlack text-sm font-bold mb-2 ml-1">Initial Status</label>
              <Select value={initialStatus} onValueChange={(v) => setInitialStatus(v as InitialStatus)}>
                <SelectTrigger className="w-full h-12 rounded-xl border border-gray-200 bg-inputBg text-textBlack">
                  <SelectValue placeholder="Active" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="sm" onClick={onClose} className="bg-inputBg text-textBlack hover:opacity-90">
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmit} className="bg-orange hover:bg-orangeHover">
              New User
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
