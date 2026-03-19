import { useEffect, useRef } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getMessages,
  sendMessage,
  markConversationRead,
  GetMessagesResponse,
  ApiMessage,
} from "@/utils/api/message.api";
import { useSocket } from "./UseSocket";
import { useAuth } from "@/store/auth-context";

type MessageCache = {
  pages: GetMessagesResponse[];
  pageParams: unknown[];
};

export function useMessages(conversationId: string | null) {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const { user } = useAuth();
  const currentUserId = user?._id;

  // Track IDs of messages we sent ourselves so the socket handler
  // can skip them (they're already in the cache via optimistic + onSuccess).
  const pendingServerIds = useRef<Set<string>>(new Set());

  const { data, isLoading, isError, error, hasNextPage, fetchNextPage } =
    useInfiniteQuery<GetMessagesResponse>({
      queryKey: ["messages", conversationId],
      queryFn: ({ pageParam }) =>
        getMessages(conversationId!, { page: pageParam as number, limit: 50 }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page, pages } = lastPage.pagination;
        return page < pages ? page + 1 : undefined;
      },
      enabled: !!conversationId,
    });

  // Mark as read when conversation opened
  useEffect(() => {
    if (!conversationId) return;
    markConversationRead(conversationId).then(() => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });
  }, [conversationId, queryClient]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNewMessage = (message: ApiMessage) => {
      if (message.conversationId !== conversationId) return;

      // If we sent this message ourselves, onSuccess already put it in the
      // cache — skip it to avoid the duplicate.
      if (pendingServerIds.current.has(message._id)) {
        pendingServerIds.current.delete(message._id);
        return;
      }

      queryClient.setQueryData<MessageCache>(
        ["messages", conversationId],
        (old) => {
          if (!old) return old;
          const lastIndex = old.pages.length - 1;
          const updatedPages = old.pages.map((page, i) => {
            if (i !== lastIndex) return page;
            // Extra guard: skip if already present by any id
            const exists = page.data.some((m) => m._id === message._id);
            if (exists) return page;
            return { ...page, data: [...page.data, message] };
          });
          return { ...old, pages: updatedPages };
        }
      );
    };

    const handleMessageRead = (data: {
      conversationId: string;
      readBy: string;
    }) => {
      if (data.conversationId !== conversationId) return;
      queryClient.setQueryData<MessageCache>(
        ["messages", conversationId],
        (old) => {
          if (!old) return old;
          const updatedPages = old.pages.map((page) => ({
            ...page,
            data: page.data.map((m) =>
              m.senderId === currentUserId
                ? { ...m, read: true, readAt: new Date().toISOString() }
                : m
            ),
          }));
          return { ...old, pages: updatedPages };
        }
      );
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:read", handleMessageRead);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:read", handleMessageRead);
    };
  }, [socket, conversationId, queryClient, currentUserId]);

  // Send with optimistic update
  const sendMutation = useMutation({
    mutationFn: (body: string) => sendMessage(conversationId!, body),

    onMutate: async (body) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", conversationId],
      });

      const optimisticMsg: ApiMessage = {
        _id: `optimistic_${Date.now()}`,
        conversationId: conversationId!,
        senderId: currentUserId!,
        senderName: "Me",
        senderInitial: "M",
        body,
        read: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<MessageCache>(
        ["messages", conversationId],
        (old) => {
          if (!old) return old;
          const lastIndex = old.pages.length - 1;
          const updatedPages = old.pages.map((page, i) => {
            if (i !== lastIndex) return page;
            return { ...page, data: [...page.data, optimisticMsg] };
          });
          return { ...old, pages: updatedPages };
        }
      );

      return { optimisticMsg };
    },

    onSuccess: (response, _body, context) => {
      // Register the real server ID so the socket handler ignores it.
      pendingServerIds.current.add(response.data._id);

      // Replace the optimistic entry with the confirmed message.
      queryClient.setQueryData<MessageCache>(
        ["messages", conversationId],
        (old) => {
          if (!old) return old;
          const updatedPages = old.pages.map((page) => ({
            ...page,
            data: page.data.map((m) =>
              m._id === context?.optimisticMsg._id ? response.data : m
            ),
          }));
          return { ...old, pages: updatedPages };
        }
      );

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },

    onError: (_err, _body, context) => {
      if (!context?.optimisticMsg) return;
      queryClient.setQueryData<MessageCache>(
        ["messages", conversationId],
        (old) => {
          if (!old) return old;
          const updatedPages = old.pages.map((page) => ({
            ...page,
            data: page.data.filter(
              (m) => m._id !== context.optimisticMsg._id
            ),
          }));
          return { ...old, pages: updatedPages };
        }
      );
    },
  });

  const rawMessages = data?.pages.flatMap((page) => page.data) ?? [];

  // Deduplicate: if a real message and an optimistic one share the same
  // server _id, keep only the real (non-optimistic) one.
  const seen = new Set<string>();
  const messages = rawMessages.filter((m) => {
    if (seen.has(m._id)) return false;
    seen.add(m._id);
    return true;
  });

  return {
    messages,
    loading: isLoading,
    error: isError ? (error as Error).message : null,
    hasMore: hasNextPage,
    loadMore: fetchNextPage,
    sendMessage: sendMutation.mutate,
    sending: sendMutation.isPending,
    sendError: sendMutation.isError,
    sendErrorMessage:
      sendMutation.error instanceof Error
        ? sendMutation.error.message
        : null,
  };
}