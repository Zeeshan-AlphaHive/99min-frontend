"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft, Phone, Video, MoreVertical, Send, Loader2, AlertCircle, PackageX } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ApiConversation } from "@/utils/api/message.api";
import { useMessages } from "@/hooks/UseMessages";
import { useAuth } from "@/store/auth-context";
import CallModal from "./CallModal";
import ChatMenu from "./ChatMenu";
import ReportUserModal from "./ReportUserModal";
import { useBlockedUsers } from "@/hooks/UseBlockedUser";
import { deleteConversation } from "@/utils/api/message.api";
import { useQueryClient } from "@tanstack/react-query";

interface ChatInterfaceProps { conversation: ApiConversation; onBack: () => void; }

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversation, onBack }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { handleBlock } = useBlockedUsers();
  const t = useTranslations();
  const [input, setInput] = useState("");
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
  const [isVoiceCallModalOpen, setIsVoiceCallModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReportUserModalOpen, setIsReportUserModalOpen] = useState(false);
  const [mutedConversations, setMutedConversations] = useState<Set<string>>(new Set());
  const [isBlockConfirmOpen, setIsBlockConfirmOpen] = useState(false);
  const [isDeleteChatConfirmOpen, setIsDeleteChatConfirmOpen] = useState(false);
  const [isTaskExpiredOpen, setIsTaskExpiredOpen] = useState(false);
  const [isCheckingTask, setIsCheckingTask] = useState(false);
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { messages, loading, error, hasMore, loadMore, sendMessage, sending, sendError, sendErrorMessage } = useMessages(conversation._id);
  const { otherParticipant, isOnline, taskId } = conversation;
  const isMuted = mutedConversations.has(conversation._id);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false); };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    sendMessage(trimmed); setInput(""); inputRef.current?.focus();
  }, [input, sending, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };
  const handleMuteNotifications = () => {
    setMutedConversations((prev) => { const next = new Set(prev); if (next.has(conversation._id)) next.delete(conversation._id); else next.add(conversation._id); return next; });
    setIsMenuOpen(false);
  };
  const handleViewAdDetails = async () => {
    setIsMenuOpen(false); if (!taskId) return;
    setIsCheckingTask(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "HEAD" });
      if (res.ok) router.push(`/dashboard/tasks/${taskId}`); else setIsTaskExpiredOpen(true);
    } catch { router.push(`/dashboard/tasks/${taskId}`); } finally { setIsCheckingTask(false); }
  };
  const handleDeleteChat = async () => {
    await deleteConversation(conversation._id);
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
    setIsDeleteChatConfirmOpen(false); onBack();
  };
  const handleBlockUser = async () => {
    await handleBlock(conversation.otherParticipant._id);
    setIsBlockConfirmOpen(false); onBack();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-inputBg">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg transition-colors shrink-0"><ArrowLeft className="w-5 h-5 text-textBlack" /></button>
        <div className="relative shrink-0">
          <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center">
            <span className="text-white text-base font-bold">{otherParticipant.initial.toUpperCase()}</span>
          </div>
          {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-textBlack font-bold text-base">{otherParticipant.name}</h2>
          <p className={`text-sm ${isOnline ? "text-green-500" : "text-textGray"}`}>{isOnline ? t("messages.online") : t("messages.offline")}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setIsVoiceCallModalOpen(true)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><Phone className="w-5 h-5 text-textGray" /></button>
          <button onClick={() => setIsVideoCallModalOpen(true)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><Video className="w-5 h-5 text-textGray" /></button>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              {isCheckingTask ? <Loader2 className="w-5 h-5 text-textGray animate-spin" /> : <MoreVertical className="w-5 h-5 text-textGray" />}
            </button>
            {isMenuOpen && <ChatMenu isMuted={isMuted} hasTask={!!taskId}
              onReportUser={() => { setIsReportUserModalOpen(true); setIsMenuOpen(false); }}
              onMuteNotifications={handleMuteNotifications} onViewAdDetails={handleViewAdDetails}
              onBlockUser={() => { setIsBlockConfirmOpen(true); setIsMenuOpen(false); }}
              onDeleteChat={() => { setIsDeleteChatConfirmOpen(true); setIsMenuOpen(false); }} />}
          </div>
        </div>
      </div>

      {isMuted && (
        <div className="bg-yellow-50 border-b border-yellow-100 px-4 py-2 text-xs text-yellow-700 text-center shrink-0">
          {t("messages.mutedBanner")} <button onClick={handleMuteNotifications} className="underline font-semibold">{t("messages.unmute")}</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {hasMore && <div className="text-center"><button onClick={() => loadMore()} className="text-xs text-textGray underline">{t("messages.loadEarlier")}</button></div>}
        {loading && <div className="space-y-4">{[...Array(4)].map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"} animate-pulse`}>
            <div className={`h-10 rounded-2xl bg-gray-200 ${i % 2 === 0 ? "w-48" : "w-36"}`} />
          </div>
        ))}</div>}
        {error && <div className="flex items-center gap-2 text-red-500 text-sm p-3 bg-red-50 rounded-xl"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
        {messages.map((msg) => {
          const isMe = msg.senderId.toString() === user?._id?.toString();
          const isOptimistic = msg._id.startsWith("optimistic_");
          const time = formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true });
          return (
            <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[75%]">
                <div className={`rounded-2xl px-4 py-2.5 transition-opacity ${isMe ? "bg-orange text-white" : "bg-lightGrey text-textBlack"} ${isOptimistic ? "opacity-60" : "opacity-100"}`}>
                  <p className="text-sm leading-relaxed">{msg.body}</p>
                </div>
                <p className={`text-textGray text-xs mt-1 px-1 ${isMe ? "text-right" : "text-left"}`}>
                  {isMe && isOptimistic ? t("messages.sending") : time}
                  {isMe && !isOptimistic && msg.read && <span className="ml-1 text-blue-400">✓✓</span>}
                  {isMe && !isOptimistic && !msg.read && <span className="ml-1 text-textGray">✓</span>}
                </p>
              </div>
            </div>
          );
        })}
        {!loading && messages.length === 0 && !error && <div className="text-center text-textGray text-sm py-8">{t("messages.noMessagesYet")}</div>}
        <div ref={bottomRef} />
      </div>

      {sendError && <div className="px-4 py-2 bg-red-50 text-red-500 text-xs text-center shrink-0">{sendErrorMessage ?? t("messages.failedSend")}</div>}

      <div className="bg-white border-t border-gray-200 px-4 py-3 shrink-0">
        <div className="flex items-end gap-3">
          <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={t("messages.typeMessage")} rows={1}
            className="flex-1 resize-none px-4 py-2.5 bg-inputBg rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-orange transition-all text-textBlack placeholder:text-textGray text-sm max-h-32 overflow-y-auto"
            style={{ lineHeight: "1.5" }} />
          <button onClick={handleSend} disabled={!input.trim() || sending} className="p-2.5 bg-orange text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0">
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-xs text-textGray mt-1.5 pl-1">{t("messages.enterHint")}</p>
      </div>

      <CallModal isOpen={isVideoCallModalOpen} onClose={() => setIsVideoCallModalOpen(false)} contactName={otherParticipant.name} contactInitial={otherParticipant.initial} callType="video" />
      <CallModal isOpen={isVoiceCallModalOpen} onClose={() => setIsVoiceCallModalOpen(false)} contactName={otherParticipant.name} contactInitial={otherParticipant.initial} callType="voice" />
      <ReportUserModal isOpen={isReportUserModalOpen} onClose={() => setIsReportUserModalOpen(false)} onSubmit={(reason, details) => console.log("Report user:", { reason, details })} userName={otherParticipant.name} />

      {isTaskExpiredOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
            <div className="w-14 h-14 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4"><PackageX className="w-7 h-7 text-orange" /></div>
            <h3 className="text-textBlack font-bold text-lg mb-2">{t("chat.adExpiredTitle")}</h3>
            <p className="text-textGray text-sm mb-6">{t("chat.adExpiredDesc")}</p>
            <button onClick={() => setIsTaskExpiredOpen(false)} className="w-full py-2.5 rounded-xl bg-orange text-white font-semibold text-sm hover:opacity-90 transition">{t("common.gotIt")}</button>
          </div>
        </div>
      )}
      {isBlockConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-textBlack font-bold text-lg mb-2">{t("chat.blockTitle")} {conversation.otherParticipant.name}?</h3>
            <p className="text-textGray text-sm mb-6">{t("chat.blockDesc")}</p>
            <div className="flex gap-3">
              <button onClick={() => setIsBlockConfirmOpen(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-textBlack font-semibold text-sm hover:bg-gray-50 transition">{t("common.cancel")}</button>
              <button onClick={handleBlockUser} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:opacity-90 transition">{t("chat.block")}</button>
            </div>
          </div>
        </div>
      )}
      {isDeleteChatConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-textBlack font-bold text-lg mb-2">{t("chat.deleteTitle")}</h3>
            <p className="text-textGray text-sm mb-6">{t("chat.deleteDesc")}</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteChatConfirmOpen(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-textBlack font-semibold text-sm hover:bg-gray-50 transition">{t("common.cancel")}</button>
              <button onClick={handleDeleteChat} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:opacity-90 transition">{t("chat.delete")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatInterface;