'use client';

import React from 'react';
import { X, MapPin, Clock, Users } from 'lucide-react';
import Image from 'next/image';

type ReportDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onBanUser: () => void;
  user: {
    name: string;
    email: string;
    plan: string;
    location: string;
  };
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-textGray mb-3">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="border-t border-gray-100" />;
}

export default function ReportDetailsModal({
  isOpen,
  onClose,
  onBanUser,
  user,
}: ReportDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 mt-2 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-semibold text-textBlack">Report Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-textGray" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Reported User */}
          <div className='mt-3'>
            <SectionLabel>Reported User</SectionLabel>
            <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl">
              <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <span className="text-base font-bold text-orange-500">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-textBlack">{user.name}</p>
                <p className="text-xs text-textGray mt-0.5">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-500 rounded-md font-medium">
                    {user.plan}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-textGray">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {user.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* Complaint */}
          <div className='mt-3'>
            <SectionLabel>
              Complaint
            </SectionLabel>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-textGray">Reason:</span>
                <span className="text-xs px-2.5 py-0.5 bg-red-100 text-red-500 font-semibold rounded-md">
                  Fraud
                </span>
              </div>
              <span className="text-xs text-textGray">10m ago</span>
            </div>
            <p className="text-sm text-textGray bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 leading-relaxed">
              User is asking for payment outside the platform and providing fake credentials.
            </p>
            <p className="text-xs text-textGray mt-3">
              Reported by:{' '}
              <span className="font-semibold text-textBlack">Sarah Miller</span>
            </p>
          </div>

          <Divider />

          {/* Related Task */}
          <div className='mt-3'>
            <SectionLabel>Related Task</SectionLabel>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="relative h-32 bg-gray-100">
                <Image
                  src="/assets/images/frame.png"
                  alt="Task"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-semibold text-orange">Fix leaky faucet</p>
                  <p className="text-sm font-semibold text-orange">$50</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-textGray">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" /> New York
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 shrink-0" /> 45m
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 shrink-0" /> 12
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* Previous Reports */}
          <div className='mt-3'>
            <SectionLabel>Previous Reports</SectionLabel>
            <div className="space-y-2">
              {[
                { reason: 'Spam', time: '2 days ago', status: 'Reviewed' },
                { reason: 'Abuse', time: '2 weeks ago', status: 'Reviewed' },
              ].map((r) => (
                <div
                  key={r.reason}
                  className="flex items-center justify-between py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      <span className="text-xs text-gray-500">⚑</span>
                    </div>
                    <span className="text-sm font-medium text-textBlack">{r.reason}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-textGray">{r.time}</span>
                    <span className="text-xs px-2.5 py-0.5 bg-gray-200 text-gray-500 rounded-md font-medium">
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-textBlack hover:bg-gray-50 transition-colors"
          >
            Delete user
          </button>
          <button
            type="button"
            onClick={onBanUser}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-medium text-white transition-colors"
          >
            Ban User
          </button>
        </div>

      </div>
    </div>
  );
}