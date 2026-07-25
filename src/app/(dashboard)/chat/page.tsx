"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { PremiumGate } from "@/components/premium/premium-gate";
import { Avatar } from "@/components/ui/avatar";
import {
  Send,
  Trash2,
  Reply,
  ArrowDown,
  MessageCircle,
  X,
  SmilePlus,
  Users,
  ChevronLeft,
  Search,
  Bell,
  Sparkles,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────
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

interface OnlineUser {
  user_id: string;
  name: string;
  avatar_url: string | null;
  username: string | null;
  online_at: string;
}

interface MessageReaction {
  message_id: string;
  emoji: string;
  count: number;
  user_reacted: boolean;
}

// ─── Emoji Data ──────────────────────────────────────────────────────────
const EMOJI_CATEGORIES: Record<string, { label: string; emojis: string[] }> = {
  smileys: {
    label: "Smileys",
    emojis: ["😀", "😂", "🤣", "😊", "😍", "🥰", "😎", "🤩", "🥳", "😏", "😅", "😉", "🤔", "🤗", "😴", "🤯", "🫡", "🤩", "😇", "🫠"],
  },
  gestures: {
    label: "Gestures",
    emojis: ["👍", "👎", "👏", "🙌", "🤝", "💪", "🫶", "✌️", "🤘", "👋", "🤙", "👊", "✊", "🫰", "🤞", "🙏", "💡", "👀", "🧠", "🎯"],
  },
  hearts: {
    label: "Hearts",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💗", "💖", "💝", "💘", "💕", "💞", "🫀", "❣️", "💔", "❤️‍🔥", "❤️‍🩹"],
  },
  objects: {
    label: "Objects",
    emojis: ["🔥", "⭐", "🌟", "✨", "💫", "🎉", "🎊", "🏆", "🥇", "🎯", "📚", "🧠", "💻", "🎵", "⚡", "🚀", "💎", "🔮", "🧩", "🎮"],
  },
  food: {
    label: "Food",
    emojis: ["☕", "🍵", "🥤", "🍕", "🍔", "🍟", "🍿", "🧁", "🍰", "🍫", "🍬", "🍭", "🍪", "🍩", "🧃", "🥛", "🫖", "🍳", "🥑", "🌮"],
  },
  nature: {
    label: "Nature",
    emojis: ["🌈", "☀️", "🌙", "⭐", "🌊", "🔥", "❄️", "🌸", "🌺", "🌻", "🍃", "🌴", "🦋", "🐝", "🐾", "🐱", "🐶", "🦁", "🐸", "🐼"],
  },
};

const QUICK_EMOJIS = ["👍", "❤️", "😂", "🔥", "💯", "🎉", "🧠", "👏", "😍", "🚀"];

// ─── Helpers ─────────────────────────────────────────────────────────────
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
      day: "numeric", month: "long", year: "numeric",
    });
    const existing = groups.get(date) || [];
    existing.push(msg);
    groups.set(date, existing);
  }
  return groups;
}

function isEmojiOnly(text: string): boolean {
  const emojiRegex = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]{1,12}$/u;
  return emojiRegex.test(text.trim());
}

// ─── Emoji Picker Component ──────────────────────────────────────────────
function EmojiPicker({ onSelect, onClose }: { onSelect: (emoji: string) => void; onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState("smileys");
  const [search, setSearch] = useState("");

  const categories = useMemo(() => Object.entries(EMOJI_CATEGORIES), []);

  const filteredEmojis = useMemo(() => {
    if (!search) return EMOJI_CATEGORIES[activeCategory]?.emojis || [];
    return Object.values(EMOJI_CATEGORIES)
      .flatMap((c) => c.emojis)
      .filter(() => true); // search is just for UX, show all when searching
  }, [activeCategory, search]);

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <SmilePlus className="h-4 w-4 text-violet-400" />
          <span className="text-xs font-semibold text-muted-foreground">Emoji</span>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Quick emojis */}
      <div className="flex gap-1 border-b border-border px-3 py-2">
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg hover:bg-accent hover:scale-110 transition-all"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 border-b border-border px-2 py-1.5 overflow-x-auto">
        {categories.map(([key, cat]) => (
          <button
            key={key}
            onClick={() => { setActiveCategory(key); setSearch(""); }}
            className={`flex-shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeCategory === key && !search
                ? "bg-violet-500/10 text-violet-400"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      <div className="grid grid-cols-8 gap-0.5 p-2 max-h-48 overflow-y-auto">
        {filteredEmojis.map((emoji, i) => (
          <button
            key={`${emoji}-${i}`}
            onClick={() => onSelect(emoji)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl hover:bg-accent hover:scale-110 transition-all"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Reaction Picker ─────────────────────────────────────────────────────
function ReactionPicker({ onSelect, onClose }: { onSelect: (emoji: string) => void; onClose: () => void }) {
  const quickReactions = ["👍", "❤️", "😂", "🔥", "💯", "🎉", "🧠", "👏"];
  return (
    <div className="absolute bottom-full mb-1 left-0 z-50 flex gap-0.5 rounded-full border border-border bg-card px-1.5 py-1 shadow-xl">
      {quickReactions.map((emoji) => (
        <button
          key={emoji}
          onClick={() => { onSelect(emoji); onClose(); }}
          className="flex h-8 w-8 items-center justify-center rounded-full text-base hover:bg-accent hover:scale-125 transition-all"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

// ─── Main Chat Content ───────────────────────────────────────────────────
function ChatContent() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<ReplyPreview | null>(null);
  const [contextMenu, setContextMenu] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactionTarget, setReactionTarget] = useState<string | null>(null);
  const [reactions, setReactions] = useState<MessageReaction[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [showOnlinePanel, setShowOnlinePanel] = useState(false);
  const [profileCache, setProfileCache] = useState<Map<string, { name: string; avatar_url: string | null; username: string | null }>>(new Map());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const PAGE_SIZE = 50;

  // ─── Get current user ──────────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  // ─── Profile fetching helper ───────────────────────────────────────────
  const fetchProfiles = useCallback(async (uids: string[]) => {
    const uncached = uids.filter((id) => !profileCache.has(id));
    if (uncached.length === 0) return;

    const supabase = createClient();
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, name, avatar_url, username")
      .in("user_id", uncached);

    if (profiles) {
      setProfileCache((prev) => {
        const next = new Map(prev);
        (profiles as Record<string, unknown>[]).forEach((p) => {
          next.set(p.user_id as string, {
            name: (p.name as string) || "Anonymous",
            avatar_url: p.avatar_url as string | null,
            username: p.username as string | null,
          });
        });
        return next;
      });
    }
  }, [profileCache]);

  // ─── Load messages ─────────────────────────────────────────────────────
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

    const userIds = [...new Set(data.map((r) => r.user_id))];
    await fetchProfiles(userIds);

    return data.map((row) => {
      const cached = profileCache.get(row.user_id);
      return {
        id: row.id,
        content: row.content,
        created_at: row.created_at,
        edited_at: row.edited_at,
        reply_to: row.reply_to,
        user_id: row.user_id,
        user_name: cached?.name || "Anonymous",
        user_avatar: cached?.avatar_url || null,
        user_username: cached?.username || null,
      };
    });
  }, [fetchProfiles, profileCache]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Load reactions ────────────────────────────────────────────────────
  const loadReactions = useCallback(async (msgIds: string[]) => {
    if (msgIds.length === 0) return;
    const supabase = createClient();
    const { data } = await supabase.rpc("get_chat_reactions", { p_message_ids: msgIds });
    if (data) setReactions(data as MessageReaction[]);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const ids = messages.map((m) => m.id);
      loadReactions(ids);
    }
  }, [messages, loadReactions]);

  // ─── Scroll handling ───────────────────────────────────────────────────
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
            requestAnimationFrame(() => {
              const c = messagesContainerRef.current;
              if (c) {
                const newHeight = c.scrollHeight;
                c.scrollTop = newHeight - c.scrollHeight + scrollTop;
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

  // ─── Real-time subscription ────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();

    // Messages channel
    const channel = supabase.channel("chat-messages");
    channel
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, async (payload) => {
        const newMsg = payload.new as ChatMessage;
        await fetchProfiles([newMsg.user_id]);
        const cached = profileCache.get(newMsg.user_id);
        setMessages((prev) => [...prev, {
          ...newMsg,
          user_name: cached?.name || "Anonymous",
          user_avatar: cached?.avatar_url || null,
          user_username: cached?.username || null,
        }]);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "chat_messages" }, (payload) => {
        const deleted = payload.old as { id: string };
        setMessages((prev) => prev.filter((m) => m.id !== deleted.id));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_reactions" }, () => {
        // Reload reactions when any reaction changes
        const ids = messages.map((m) => m.id);
        if (ids.length > 0) loadReactions(ids);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channel.track({ user_id: userId, online_at: new Date().toISOString() });
        }
      });

    // Presence channel
    const presenceChannel = supabase.channel("chat-presence");
    presenceChannel
      .on("presence", { event: "sync" }, async () => {
        const state = presenceChannel.presenceState();
        const allPresences: OnlineUser[] = [];
        Object.values(state).forEach((presences) => {
          (presences as unknown[]).forEach((p) => {
            const raw = p as Record<string, unknown>;
            if (raw.user_id) allPresences.push({
              user_id: raw.user_id as string,
              name: "Anonymous",
              avatar_url: null,
              username: null,
              online_at: (raw.online_at as string) || "",
            });
          });
        });
        const uniqueMap = new Map<string, OnlineUser>();
        allPresences.forEach((p) => uniqueMap.set(p.user_id, p));

        // Fetch profiles for online users
        const uids = [...uniqueMap.keys()];
        await fetchProfiles(uids);

        const usersWithProfiles = uids.map((uid) => {
          const p = uniqueMap.get(uid);
          const cached = profileCache.get(uid);
          return {
            ...p!,
            name: cached?.name || "Anonymous",
            avatar_url: cached?.avatar_url || null,
            username: cached?.username || null,
          };
        });

        setOnlineUsers(usersWithProfiles);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ─── Auto-scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ─── Send message ──────────────────────────────────────────────────────
  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending || content.length > 2000) return;
    setSending(true);
    setInput("");
    setReplyTo(null);
    setShowEmojiPicker(false);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSending(false); return; }

    await supabase.from("chat_messages").insert({
      user_id: user.id,
      content,
      reply_to: replyTo?.id || null,
    });

    setSending(false);
    inputRef.current?.focus();
  };

  // ─── Delete message ────────────────────────────────────────────────────
  const handleDelete = async (messageId: string) => {
    const supabase = createClient();
    await supabase.rpc("delete_chat_message", { p_message_id: messageId });
    setContextMenu(null);
  };

  // ─── Toggle reaction ───────────────────────────────────────────────────
  const handleReaction = async (messageId: string, emoji: string) => {
    const supabase = createClient();
    const existing = reactions.find(
      (r) => r.message_id === messageId && r.emoji === emoji && r.user_reacted
    );

    if (existing) {
      // Remove reaction
      await supabase
        .from("chat_reactions")
        .delete()
        .eq("message_id", messageId)
        .eq("emoji", emoji);
    } else {
      // Add reaction
      await supabase.from("chat_reactions").insert({
        message_id: messageId,
        user_id: userId,
        emoji,
      });
    }
    setReactionTarget(null);
    // Reload reactions
    const ids = messages.map((m) => m.id);
    loadReactions(ids);
  };

  // ─── Keyboard ──────────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInput((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  // ─── Helpers ───────────────────────────────────────────────────────────
  const getReplyMessage = (replyId: string) => messages.find((m) => m.id === replyId);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  const getMessageReactions = (msgId: string) => reactions.filter((r) => r.message_id === msgId);
  const dateGroups = groupMessagesByDate(messages);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] overflow-hidden relative">
      {/* ─── Main Chat Column ────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
            </div>
            <div>
              <h1 className="text-sm font-bold">{t.chat_title}</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                {onlineUsers.length > 0
                  ? `${onlineUsers.length} ${t.chat_online}`
                  : t.chat_members}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <Search className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors relative">
              <Bell className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowOnlinePanel(!showOnlinePanel)}
              className={`rounded-lg p-2 transition-colors ${
                showOnlinePanel
                  ? "bg-violet-500/10 text-violet-400"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-3"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139,92,246,0.03) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        >
          {/* Welcome banner */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/10">
                <Sparkles className="h-10 w-10 text-violet-400" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Welcome to the Community!</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Connect with other brain trainers. Share tips, ask questions, and grow together.
              </p>
              <div className="mt-4 flex gap-2">
                {["🧠", "💪", "🎯", "🚀"].map((emoji, i) => (
                  <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}>
                    {emoji}
                  </span>
                ))}
              </div>
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
                <span className="rounded-full bg-card border border-border px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
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
                const msgReactions = getMessageReactions(msg.id);
                const emojiOnly = isEmojiOnly(msg.content);

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"} ${!isConsecutive ? "mt-3" : "mt-0.5"}`}
                  >
                    {/* Avatar */}
                    {!isOwn && (
                      <div className="mr-2 flex-shrink-0 self-end">
                        {isLast ? (
                          <div className="relative">
                            <Avatar src={msg.user_avatar} name={msg.user_name} size="xs" />
                            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
                          </div>
                        ) : (
                          <div className="h-7 w-7" />
                        )}
                      </div>
                    )}

                    <div
                      className={`group relative ${emojiOnly ? "" : "max-w-[75%]"} ${isOwn ? "items-end" : "items-start"}`}
                    >
                      {/* Username */}
                      {!isOwn && !isConsecutive && (
                        <div className="mb-1 ml-1 flex items-center gap-1.5">
                          <span className="text-xs font-bold text-violet-400">{msg.user_name}</span>
                          {msg.user_username && (
                            <span className="text-[10px] text-muted-foreground">@{msg.user_username}</span>
                          )}
                        </div>
                      )}

                      {/* Reply preview */}
                      {replyTarget && (
                        <div className={`mb-0.5 rounded-t-xl border-l-[3px] border-violet-400 bg-muted/40 px-3 py-2 text-xs ${
                          isOwn ? "rounded-tr-none" : "rounded-tl-none"
                        }`}>
                          <p className="font-semibold text-violet-400">{replyTarget.user_name}</p>
                          <p className="truncate text-muted-foreground">{replyTarget.content}</p>
                        </div>
                      )}

                      {/* Message bubble */}
                      <div
                        className={`relative ${
                          emojiOnly
                            ? "text-4xl py-1"
                            : `rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                                isOwn
                                  ? `bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-md shadow-violet-500/10 ${
                                      !replyTarget && isConsecutive ? "rounded-tr-md" : ""
                                    } ${isLast ? "rounded-br-md" : ""}`
                                  : `bg-card border border-border ${
                                      !replyTarget && isConsecutive ? "rounded-tl-md" : ""
                                    } ${isLast ? "rounded-bl-md" : ""}`
                              }`
                        }`}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setContextMenu(contextMenu === msg.id ? null : msg.id);
                          setReactionTarget(null);
                        }}
                        onDoubleClick={() => {
                          if (reactionTarget === msg.id) {
                            setReactionTarget(null);
                          } else {
                            setReactionTarget(msg.id);
                          }
                        }}
                      >
                        {!emojiOnly && <p className="whitespace-pre-wrap break-words">{msg.content}</p>}
                        {emojiOnly && <span>{msg.content}</span>}
                        {!emojiOnly && (
                          <p className={`mt-1 text-[10px] ${isOwn ? "text-white/50" : "text-muted-foreground"} text-right`}>
                            {formatTime(msg.created_at, t)}
                          </p>
                        )}
                      </div>

                      {/* Reactions */}
                      {msgReactions.length > 0 && (
                        <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
                          {msgReactions.map((r) => (
                            <button
                              key={r.emoji}
                              onClick={() => handleReaction(msg.id, r.emoji)}
                              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-all hover:scale-105 ${
                                r.user_reacted
                                  ? "border-violet-400 bg-violet-500/10 text-violet-400"
                                  : "border-border bg-muted hover:bg-accent"
                              }`}
                            >
                              <span>{r.emoji}</span>
                              <span className="font-medium">{r.count}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Reaction picker */}
                      {reactionTarget === msg.id && (
                        <ReactionPicker
                          onSelect={(emoji) => handleReaction(msg.id, emoji)}
                          onClose={() => setReactionTarget(null)}
                        />
                      )}

                      {/* Context menu */}
                      {contextMenu === msg.id && (
                        <div className={`absolute z-50 mt-1 rounded-xl border border-border bg-card p-1.5 shadow-xl ${
                          isOwn ? "right-0" : "left-0"
                        }`}>
                          <div className="flex gap-0.5 mb-1 pb-1 border-b border-border">
                            {["👍", "❤️", "😂", "🔥", "🧠"].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => { handleReaction(msg.id, emoji); setContextMenu(null); }}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-sm hover:bg-accent hover:scale-110 transition-all"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => {
                              setReplyTo({ id: msg.id, content: msg.content, user_name: msg.user_name });
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

                    {isOwn && <div className="ml-2 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-28 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-xl hover:bg-accent transition-all animate-in fade-in"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        )}

        {/* Reply preview bar */}
        {replyTo && (
          <div className="flex items-center gap-2 border-t border-border bg-card/80 backdrop-blur-sm px-4 py-2.5 flex-shrink-0">
            <div className="flex-shrink-0 rounded-lg bg-violet-500/10 p-1.5">
              <Reply className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-violet-400">{replyTo.user_name}</p>
              <p className="text-xs text-muted-foreground truncate">{replyTo.content}</p>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="flex-shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-border bg-background/80 backdrop-blur-sm px-4 py-3 flex-shrink-0 relative">
          {/* Emoji picker */}
          {showEmojiPicker && (
            <EmojiPicker
              onSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}

          <div className="flex items-end gap-2">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`flex h-[42px] w-[42px] items-center justify-center rounded-xl transition-all flex-shrink-0 ${
                showEmojiPicker
                  ? "bg-violet-500/10 text-violet-400"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <SmilePlus className="h-5 w-5" />
            </button>

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.chat_placeholder}
              rows={1}
              maxLength={2000}
              className="flex-1 resize-none rounded-2xl border border-border bg-muted/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/30 max-h-32 transition-all"
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
              className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-lg shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-purple-600 hover:shadow-violet-500/30 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
            >
              {sending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Character count */}
          <div className="flex justify-end mt-1">
            <span className={`text-[10px] ${input.length > 1800 ? "text-destructive" : "text-muted-foreground"}`}>
              {input.length}/2000
            </span>
          </div>

          {/* Quick emoji bar */}
          <div className="flex gap-1 mt-2 overflow-x-auto pb-0.5">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setInput((prev) => prev + emoji)}
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-sm hover:bg-accent hover:scale-110 transition-all"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Online Users Panel ──────────────────────────────────────────── */}
      <div
        className={`border-l border-border bg-background/80 backdrop-blur-sm transition-all duration-300 overflow-hidden flex-shrink-0 ${
          showOnlinePanel ? "w-72" : "w-0"
        } hidden lg:block`}
      >
        <div className="w-72 h-full flex flex-col">
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-violet-400" />
              <h2 className="text-sm font-bold">Online</h2>
            </div>
            <button
              onClick={() => setShowOnlinePanel(false)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          {/* Online count */}
          <div className="border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-green-500 animate-ping" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {onlineUsers.length} {t.chat_online}
              </span>
            </div>
          </div>

          {/* User list */}
          <div className="flex-1 overflow-y-auto">
            {onlineUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">No one else is online right now</p>
              </div>
            )}

            {onlineUsers.map((user) => (
              <div
                key={user.user_id}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="relative flex-shrink-0">
                  <Avatar src={user.avatar_url} name={user.name} size="sm" />
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  {user.username && (
                    <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                  )}
                </div>
                {user.user_id === userId && (
                  <span className="text-[10px] font-medium text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded-full">You</span>
                )}
              </div>
            ))}
          </div>

          {/* Panel footer */}
          <div className="border-t border-border px-4 py-3">
            <div className="rounded-xl bg-muted/50 px-3 py-2.5">
              <p className="text-[11px] text-muted-foreground text-center">
                🧠 Training together makes us stronger
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile Online Panel (overlay) ─────────────────────────────── */}
      {showOnlinePanel && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowOnlinePanel(false)} />
          <div className="ml-auto w-72 h-full bg-background border-l border-border flex flex-col relative z-10 animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-violet-400" />
                <h2 className="text-sm font-bold">Online</h2>
              </div>
              <button
                onClick={() => setShowOnlinePanel(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {onlineUsers.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent/50 transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <Avatar src={user.avatar_url} name={user.name} size="sm" />
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    {user.username && (
                      <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                    )}
                  </div>
                  {user.user_id === userId && (
                    <span className="text-[10px] font-medium text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded-full">You</span>
                  )}
                </div>
              ))}
              {onlineUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                  <p className="text-xs text-muted-foreground">No one else is online right now</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────
export default function ChatPage() {
  const { t } = useI18n();
  return (
    <PremiumGate feature={t.chat_premium_note}>
      <ChatContent />
    </PremiumGate>
  );
}
