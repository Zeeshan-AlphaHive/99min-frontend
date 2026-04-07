"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Flag, Share2, MoreVertical, Pencil, Trash2, Loader2, Play } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ReportAdModal from './ReportAdModal';
import ShareAdModal from './ShareAdModal';
import DeleteAdModal from './DeleteAdModal';
import TaskDetailsHeader from './TaskDetailsHeader';
import TaskHeader from './TaskHeader';
import TaskDetailCards from './TaskDetailCards';
import TaskDescription from './TaskDescription';
import TaskTags from './TaskTags';
import TaskDetailsCTA from './TaskDetailsCTA';
import dog from '@/public/assets/images/dog.jpg';
import { useReportTask, useShareTask } from '@/hooks/UseTasks';
import { getOrCreateConversation, sendMessage } from '@/utils/api/message.api';
import { useRouter } from 'next/navigation';

export interface TaskDetailsData {
  _id: string; image: string; title: string; description: string;
  price: string; location: string; timeLeft: string; interest: number;
  urgent?: boolean; category?: string; postedTime?: string; tags?: string[]; posterUserId?: string;
}

interface TaskDetailsProps { task: TaskDetailsData; onBack: () => void; isOwner?: boolean; onEdit?: () => void; onDelete?: () => void; }

// ─── Detect if a URL points to a video file ──────────────────────────────────
const isVideoUrl = (url: string): boolean =>
  /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i.test(url);

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onBack, isOwner = false, onEdit, onDelete }) => {
  const router = useRouter();
  const t = useTranslations();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const { title, description, price, location, timeLeft, interest, urgent = false, category = 'General', postedTime = t("task.postedTime"), tags = [] } = task;
  const imageSrc = task.image && task.image.length > 0 ? task.image : dog.src;
  const isVideo = isVideoUrl(imageSrc);

  const { mutateAsync: report } = useReportTask(task._id);
  const { mutate: recordShare } = useShareTask();

  // Seek to 1s so the hero shows a real frame instead of black
  const handleVideoMetadata = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(1, videoRef.current.duration / 2);
    }
  };

  const handleSendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || !task.posterUserId) return;
    setSending(true); setSendError(null);
    try {
      const res = await getOrCreateConversation(task.posterUserId, task._id);
      await sendMessage(res.data._id, trimmed);
      router.push(`/dashboard/messages?conversationId=${res.data._id}`);
    } catch (err) { setSendError(err instanceof Error ? err.message : t("common.error")); setSending(false); }
  };

  const handleReportSubmit = async (reason: string, details: string) => {
    await report({ reason: reason as 'spam' | 'inappropriate' | 'scam' | 'duplicate' | 'other', details });
    setIsReportModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <TaskDetailsHeader onBack={onBack} onReport={!isOwner ? () => setIsReportModalOpen(true) : undefined} onShare={!isOwner ? () => setIsShareModalOpen(true) : undefined} />

      {/* ─── Main content wrapper: centered, max-width, responsive padding ── */}
      <div className="max-w-7xl mx-auto pb-28 md:pb-32">

        {/* ─── Hero Media: fluid height across breakpoints ───────────────── */}
        <div className="relative w-full h-64 sm:h-80 md:h-[420px] lg:h-[500px] mb-0 bg-gray-100 rounded-b-4xl overflow-hidden">
          {isVideo ? (
            <>
              <video
                ref={videoRef}
                src={imageSrc}
                className="w-full h-full object-cover"
                muted
                playsInline
                controls
                preload="metadata"
                onLoadedMetadata={handleVideoMetadata}
              />
              {/* Video label badge */}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 pointer-events-none">
                <Play className="w-3.5 h-3.5 text-white fill-white" />
                <span className="text-white text-xs font-semibold">Video</span>
              </div>
            </>
          ) : (
            <Image src={imageSrc} alt={title} fill className="object-cover rounded-b-4xl" />
          )}

          {/* ─── Top-left: Share / Report ──────────────────────────────── */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            {!isOwner && (
              <>
                <button onClick={() => setIsShareModalOpen(true)} className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition" aria-label={t("task.shareAd")}>
                  <Share2 className="w-4 h-4 text-orange" />
                </button>
                <button onClick={() => setIsReportModalOpen(true)} className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition" aria-label={t("task.reportAd")}>
                  <Flag className="w-4 h-4 text-orange" />
                </button>
              </>
            )}
          </div>

          {/* ─── Top-right: Owner menu ─────────────────────────────────── */}
          {isOwner && (
            <div ref={menuRef} className="absolute top-4 right-4 z-10">
              <button onClick={() => setMenuOpen((p) => !p)} className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition">
                <MoreVertical className="w-4 h-4 text-gray-700" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                  <button type="button" onClick={() => { setMenuOpen(false); onEdit?.(); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                    <Pencil className="w-4 h-4 text-orange" />{t("task.editTask")}
                  </button>
                  <button type="button" onClick={() => { setMenuOpen(false); setIsDeleteModalOpen(true); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition">
                    <Trash2 className="w-4 h-4" />{t("task.deleteTask")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── Content area: responsive horizontal padding ───────────────── */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-10">
          <TaskHeader title={title} price={price} urgent={urgent} postedTime={postedTime} timeLeft={timeLeft} />

          <div className="bg-white pb-6">
            {/* ─── Detail cards: 2-col on tablet, flows naturally ────────── */}
            <TaskDetailCards location={location} category={category} interest={interest} />
            <TaskDescription description={description} />
            {/* <TaskTags tags={tags} /> */}

            {!isOwner && (
              <div className="mt-6">
                <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
                  {t("task.sendMessage")}
                </label>
                {/* ─── Textarea: wider on tablet/desktop ─────────────────── */}
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("task.messagePlaceholder")}
                  className="w-full md:max-w-2xl border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange resize-none"
                  rows={4}
                  disabled={sending}
                />
                {sendError && <p className="text-red-500 text-xs mt-1">{sendError}</p>}
                {!task.posterUserId && <p className="text-textGray text-xs mt-1">{t("task.cannotMessage")}</p>}
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={sending || !message.trim() || !task.posterUserId}
                  className="mt-2 bg-orange text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm md:text-base"
                >
                  {sending ? <><Loader2 className="w-4 h-4 animate-spin" />{t("task.sending")}</> : t("task.send")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isOwner && <TaskDetailsCTA />}
      <ReportAdModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} onSubmit={handleReportSubmit} />
      <ShareAdModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} onShare={(platform) => { recordShare(task._id); console.log('Shared on:', platform); }} />
      <DeleteAdModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => { setIsDeleteModalOpen(false); onDelete?.(); }} />
    </div>
  );
};

export default TaskDetails;