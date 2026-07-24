"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { PremiumGate } from "@/components/premium/premium-gate";
import { Avatar } from "@/components/ui/avatar";
import {
  Send,
  Trash2,
  Reply,
  ArrowDown,
  Users,
  MessageCircle,
  X,
} from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  edited_at: string | null;
  reply_to: string | null;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  user_username: string | null;
}

interface ReplyPreview {
  id: string;
  content: string;
  user_name: string;
}

function formatTime(iso: string, t: ReturnType<typeof useI18n>["t"]): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return t.chat_just_now;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}${t.chat_minutes_ago}`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}${t.chat_hours_ago}`;
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function groupMessagesByDate(messages: ChatMessage[]): Map<string, ChatMessage[]> {
  const groups = new Map<string, ChatMessage[]>();
  for (const msg of messages) {
    const date = new Date(msg.created_at).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const existing = groups.get(date) || [];
    existing.push(msg);
    groups.set(date, existing);
  }
  return groups;
}

function ChatContent() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [replyTo, setReplyTo] = useState<ReplyPreview | null>(null);
  const [contextMenu, setContextMenu] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  const PAGE_SIZE = 50;

  // Get current user
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  // Load initial messages
  const loadMessages = useCallback(async (before?: string) => {
    const supabase = createClient();
    const query = supabase
      .from("chat_messages")
      .select("id, content, created_at, edited_at, reply_to, user_id")
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE);

    if (before) query.lt("created_at", before);

    const { data, error } = await query;
    if (error || !data) return [];

    // Fetch unique user profiles
    const userIds = [...new Set(data.map((r: Record<string, unknown>) => r.user_id as string))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, name, avatar_url, username")
      .in("user_id", userIds);

    const profileMap = new Map<string, { name: string; avatar_url: string | null; username: string | null }>();
    (profiles || []).forEach((p: Record<string, unknown>) => {
      profileMap.set(p.user_id as string, {
        name: (p.name as string) || "Anonymous",
        avatar_url: p.avatar_url as string | null,
        username: p.username as string | null,
      });
    });

    return data.map((row: Record<string, unknown>) => {
      const profile = profileMap.get(row.user_id as string);
      return {
        id: row.id as string,
        content: row.content as string,
        created_at: row.created_at as string,
        edited_at: row.edited_at as string | null,
        reply_to: row.reply_to as string | null,
        user_id: row.user_id as string,
        user_name: profile?.name || "Anonymous",
        user_avatar: profile?.avatar_url || null,
        user_username: profile?.username || null,
      };
    });
  }, []);

  useEffect(() => {
    (async () => {
      const initial = await loadMessages();
      setMessages(initial.reverse());
      setHasMore(initial.length === PAGE_SIZE);
      setLoading(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      }, 100);
    })();
  }, [loadMessages]);

  // Load older messages on scroll to top
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 200);

    if (scrollTop < 50 && hasMore && !loadingMore) {
      setLoadingMore(true);
      const oldest = messages[0];
      if (oldest) {
        loadMessages(oldest.created_at).then((older) => {
          if (older.length > 0) {
            setMessages((prev) => [...older, ...prev]);
            setHasMore(older.length === PAGE_SIZE);
            // Maintain scroll position
            requestAnimationFrame(() => {
              const container = messagesContainerRef.current;
              if (container) {
                const newHeight = container.scrollHeight;
                container.scrollTop = newHeight - container.scrollHeight + scrollTop;
              }
            });
          } else {
            setHasMore(false);
          }
          setLoadingMore(false);
        });
      }
    }
  }, [messages, hasMore, loadingMore, loadMessages]);

  // Real-time subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel("chat-messages");

    channel
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
      }, async (payload) => {
        const newMsg = payload.new as ChatMessage;
        // Fetch profile info
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, avatar_url, username")
          .eq("user_id", newMsg.user_id)
          .maybeSingle();

        setMessages((prev) => [...prev, {
          ...newMsg,
          user_name: profile?.name || "Anonymous",
          user_avatar: profile?.avatar_url || null,
          user_username: profile?.username || null,
        }]);
      })
      .on("postgres_changes", {
        event: "DELETE",
        schema: "public",
        table: "chat_messages",
      }, (payload) => {
        const deleted = payload.old as { id: string };
        setMessages((prev) => prev.filter((m) => m.id !== deleted.id));
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channelRef.current = channel;
          // Track presence
          channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        }
      });

    // Presence: count online users
    const presenceChannel = supabase.channel("chat-presence");
    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        const unique = new Set(Object.values(state).flat().map((p: Record<string, unknown>) => p.user_id));
        setOnlineCount(unique.size);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(presenceChannel);
    };
  }, [userId]);

  // Auto-scroll on new messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send message
  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;

    setSending(true);
    setInput("");
    setReplyTo(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSending(false); return; }

    const { error } = await supabase.from("chat_messages").insert({
      user_id: user.id,
      content,
      reply_to: replyTo?.id || null,
    });

    setSending(false);
    inputRef.current?.focus();
  };

  // Delete message
  const handleDelete = async (messageId: string) => {
    const supabase = createClient();
    await supabase.rpc("delete_chat_message", { p_message_id: messageId });
    setContextMenu(null);
  };

  // Keyboard handling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Find reply target
  const getReplyMessage = (replyId: string) => messages.find((m) => m.id === replyId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const dateGroups = groupMessagesByDate(messages);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">{t.chat_title}</h1>
            <p className="text-xs text-muted-foreground">
              {onlineCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {onlineCount} {t.chat_online}
                  {onlineCount > 1 && "s"} ·{" "}
                </span>
              )}
              {t.chat_members}
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-1"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">{t.chat_empty}</p>
          </div>
        )}

        {loadingMore && (
          <div className="flex justify-center py-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {Array.from(dateGroups.entries()).map(([date, msgs]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center justify-center py-3">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {date}
              </span>
            </div>

            {msgs.map((msg, idx) => {
              const isOwn = msg.user_id === userId;
              const prevMsg = idx > 0 ? msgs[idx - 1] : null;
              const nextMsg = idx < msgs.length - 1 ? msgs[idx + 1] : null;
              const isConsecutive = prevMsg?.user_id === msg.user_id;
              const isLast = nextMsg?.user_id !== msg.user_id;
              const replyTarget = msg.reply_to ? getReplyMessage(msg.reply_to) : null;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"} ${!isConsecutive ? "mt-2" : "mt-0.5"}`}
                >
                  {/* Avatar for other users */}
                  {!isOwn && (
                    <div className="mr-2 flex-shrink-0">
                      {isLast ? (
                        <Avatar
                          src={msg.user_avatar}
                          name={msg.user_name}
                          size="xs"
                        />
                      ) : (
                        <div className="h-7 w-7" />
                      )}
                    </div>
                  )}

                  <div
                    className={`group relative max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}
                  >
                    {/* Username for group messages */}
                    {!isOwn && !isConsecutive && (
                      <p className="mb-0.5 ml-1 text-xs font-medium text-violet-400">
                        {msg.user_name}
                      </p>
                    )}

                    {/* Reply preview */}
                    {replyTarget && (
                      <div
                        className={`mb-0.5 rounded-t-lg border-l-2 border-violet-400 bg-muted/50 px-2.5 py-1.5 text-xs ${
                          isOwn ? "rounded-tr-none" : "rounded-tl-none"
                        }`}
                      >
                        <p className="font-medium text-violet-400">{replyTarget.user_name}</p>
                        <p className="truncate text-muted-foreground">{replyTarget.content}</p>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`relative rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        isOwn
                          ? `bg-gradient-to-br from-violet-600 to-purple-700 text-white ${
                              !replyTarget && isConsecutive ? "rounded-tr-md" : ""
                            } ${isLast ? "rounded-br-md" : ""}`
                          : `bg-muted ${
                              !replyTarget && isConsecutive ? "rounded-tl-md" : ""
                            } ${isLast ? "rounded-bl-md" : ""}`
                      }`}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu(contextMenu === msg.id ? null : msg.id);
                      }}
                      onDoubleClick={() => {
                        if (isOwn) setContextMenu(contextMenu === msg.id ? null : msg.id);
                      }}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      <p
                        className={`mt-0.5 text-[10px] ${
                          isOwn ? "text-white/60" : "text-muted-foreground"
                        } text-right`}
                      >
                        {formatTime(msg.created_at, t)}
                      </p>
                    </div>

                    {/* Context menu */}
                    {contextMenu === msg.id && (
                      <div
                        className={`absolute z-50 mt-1 rounded-xl border border-border bg-card p-1 shadow-lg ${
                          isOwn ? "right-0" : "left-0"
                        }`}
                      >
                        <button
                          onClick={() => {
                            setReplyTo({
                              id: msg.id,
                              content: msg.content,
                              user_name: msg.user_name,
                            });
                            setContextMenu(null);
                            inputRef.current?.focus();
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                          <Reply className="h-3.5 w-3.5" />
                          {t.chat_reply}
                        </button>
                        {isOwn && (
                          <button
                            onClick={() => handleDelete(msg.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {t.chat_delete}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Avatar for own messages */}
                  {isOwn && <div className="ml-2 flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-lg border border-border hover:bg-accent transition-all"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      )}

      {/* Reply preview bar */}
      {replyTo && (
        <div className="flex items-center gap-2 border-t border-border bg-card px-4 py-2">
          <Reply className="h-4 w-4 text-violet-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-violet-400">{replyTo.user_name}</p>
            <p className="text-xs text-muted-foreground truncate">{replyTo.content}</p>
          </div>
          <button
            onClick={() => setReplyTo(null)}
            className="flex-shrink-0 p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-border bg-background px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.chat_placeholder}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border bg-muted px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 max-h-32"
            style={{ minHeight: "42px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 128) + "px";
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 text-white transition-all hover:from-violet-500 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            {sending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { t } = useI18n();

  return (
    <PremiumGate feature={t.chat_premium_note}>
      <ChatContent />
    </PremiumGate>
  );
}
