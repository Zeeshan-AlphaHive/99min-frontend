"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Clock, Share2, Flag, MoreVertical, Pencil, Trash2, Loader2, Play } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useOpenChat } from '@/hooks/UseOpenChat';

interface TaskCardProps {
  image: string; title: string; description: string; price: string; location: string;
  timeLeft: string; interest: number; urgent?: boolean; isOwner?: boolean;
  posterUserId?: string; taskId?: string;
  onClick?: () => void; onShare?: () => void; onReport?: () => void; onEdit?: () => void; onDelete?: () => void;
}

// ─── Detect if a URL points to a video file ──────────────────────────────────
const isVideoUrl = (url: string): boolean =>
  /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i.test(url);

const TaskCard: React.FC<TaskCardProps> = ({
  image, title, description, price, location, timeLeft, interest, urgent,
  isOwner = false, posterUserId, taskId,
  onClick, onShare, onReport, onEdit, onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { openChat, loading: chatLoading } = useOpenChat();
  const t = useTranslations();

  const isVideo = isVideoUrl(image);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Seek video to 1s on metadata load so the poster frame is meaningful
  const handleVideoMetadata = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(1, videoRef.current.duration / 2);
    }
  };

  const handleContactUs = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (posterUserId) openChat(posterUserId, taskId);
  };

  return (
    <div onClick={onClick} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative">
      <div className="relative mb-4">

        {/* ─── Media: image or video ─────────────────────────────────────── */}
        <div className="relative w-full h-[200px] rounded-xl overflow-hidden bg-gray-100">
          {isVideo ? (
            <>
              <video
                ref={videoRef}
                src={image}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
                onLoadedMetadata={handleVideoMetadata}
              />
              {/* Play badge so users know it's a video */}
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                <Play className="w-3 h-3 text-white fill-white" />
                <span className="text-white text-xs font-medium">Video</span>
              </div>
            </>
          ) : (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              unoptimized
            />
          )}
        </div>

        {/* ─── Top-left: Share / Report ──────────────────────────────────── */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {!isOwner && onShare && (
            <button type="button" onClick={(e) => { e.stopPropagation(); onShare(); }}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition" aria-label="Share">
              <Share2 className="w-4 h-4 text-orange" />
            </button>
          )}
          {!isOwner && onReport && (
            <button type="button" onClick={(e) => { e.stopPropagation(); onReport(); }}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition" aria-label="Report">
              <Flag className="w-4 h-4 text-orange" />
            </button>
          )}
        </div>

        {/* ─── Top-right: Urgent badge / Owner menu ─────────────────────── */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          {urgent && (
            <div className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
              {t("task.urgent")}
            </div>
          )}
          {isOwner && (
            <div ref={menuRef} className="relative">
              <button type="button" onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition" aria-label="More options">
                <MoreVertical className="w-4 h-4 text-gray-700" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                  <button type="button" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit?.(); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                    <Pencil className="w-4 h-4 text-orange" />{t("task.editTask")}
                  </button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete?.(); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition">
                    <Trash2 className="w-4 h-4" />{t("task.deleteTask")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <h3 className="text-lg font-bold text-textBlack mb-2 leading-tight">{title}</h3>
      <p className="text-textGray text-sm mb-4 leading-relaxed line-clamp-2">{description}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-black text-orange">${price}</div>
        <div className="flex items-center text-textBlack text-sm font-bold gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          {interest} {t("task.interest")}
        </div>
      </div>

      <div className="flex items-center justify-between text-gray-400 text-sm font-medium">
        <div className="flex items-center gap-1.5"><MapPin className="w-5 h-5" />{location}</div>
        <div className="flex items-center text-orange bg-iconBg px-2 py-2 rounded-full gap-1.5">
          <Clock className="w-5 h-5 text-orange" />{timeLeft}
        </div>
      </div>

      {!isOwner && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
          <button onClick={handleContactUs} disabled={chatLoading || !posterUserId}
            className="flex items-center gap-2 text-textBlack font-bold hover:text-orange transition-colors disabled:opacity-50">
            {chatLoading
              ? <><Loader2 className="w-4 h-4 animate-spin" />{t("task.openingChat")}</>
              : t("task.contactUs")}
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;