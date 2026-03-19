"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';

interface CallModalProps { isOpen: boolean; onClose: () => void; contactName: string; contactInitial: string; callType: 'video' | 'voice'; }

const CallModal: React.FC<CallModalProps> = ({ isOpen, onClose, contactName, contactInitial, callType }) => {
  const t = useTranslations();
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) { document.addEventListener('keydown', handleEscape); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', handleEscape); document.body.style.overflow = 'unset'; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const title = callType === 'video' ? t("call.videoCall") : t("call.voiceCall");
  const message = callType === 'video' ? t("call.videoComingSoon") : t("call.voiceComingSoon");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-textBlack">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-lg transition-colors" aria-label={t("common.close")}><X className="w-5 h-5 text-textBlack" /></button>
        </div>
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-orange rounded-full flex items-center justify-center">
              <span className="text-white text-4xl font-bold">{contactInitial.toUpperCase()}</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-textBlack text-center mb-3">{contactName}</h3>
          <p className="text-textGray text-center mb-6">{message}</p>
          <Button variant="primary" size="lg" fullWidth onClick={onClose}>{t("common.gotIt")}</Button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;