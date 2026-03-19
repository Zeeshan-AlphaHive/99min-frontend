"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Clock, Share2, Flag, MoreVertical, Pencil, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useOpenChat } from '@/hooks/UseOpenChat';
import { useI18n } from '@/contexts/i18n-context';

interface TaskCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
  location: string;
  timeLeft: string;
  interest: number;
  urgent?: boolean;
  isOwner?: boolean;
  posterUserId?: string; // task poster's user ID
  taskId?: string;       // task ID for context
  onClick?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  image,
  title,
  description,
  price,
  location,
  timeLeft,
  interest,
  urgent,
  isOwner = false,
  posterUserId,
  taskId,
  onClick,
  onShare,
  onReport,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { openChat, loading: chatLoading } = useOpenChat();
  const { tr } = useI18n();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleContactUs = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (posterUserId) {
      openChat(posterUserId, taskId);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
    >
      <div className="relative mb-4">
        <div className="relative w-full h-[200px] rounded-xl overflow-hidden">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>

        {/* Left overlay: Share + Report (non-owner only) */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {!isOwner && onShare && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onShare(); }}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4 text-orange" />
            </button>
          )}
          {!isOwner && onReport && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onReport(); }}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition"
              aria-label="Report"
            >
              <Flag className="w-4 h-4 text-orange" />
            </button>
          )}
        </div>

        {/* Right overlay: Urgent badge + three-dots (owner only) */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          {urgent && (
            <div className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
              {tr("Urgent")}
            </div>
          )}

          {isOwner && (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4 text-gray-700" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit?.(); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Pencil className="w-4 h-4 text-orange" />
                    {tr("Edit Task")}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete?.(); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    {tr("Delete Task")}
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
          {tr(`${interest} interest`)}
        </div>
      </div>

      <div className="flex items-center justify-between text-gray-400 text-sm font-medium">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-5 h-5" />
          {location}
        </div>
        <div className="flex items-center text-orange bg-iconBg px-2 py-2 rounded-full gap-1.5">
          <Clock className="w-5 h-5 text-orange" />
          {timeLeft}
        </div>
      </div>

      {!isOwner && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
          <button
            onClick={handleContactUs}
            disabled={chatLoading || !posterUserId}
            className="flex items-center gap-2 text-textBlack font-bold hover:text-orange transition-colors disabled:opacity-50"
          >
            {chatLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {tr("Opening chat...")}
              </>
            ) : (
              tr("Contact us")
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;