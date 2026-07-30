"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth";
import { Users, UserPlus, Flame, Trophy, X, Check, Search } from "lucide-react";

interface Partner {
  user_id: string;
  name: string;
  avatar_url: string | null;
  current_streak: number;
  level: string;
  last_active: string;
}

interface PartnerRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: "pending" | "accepted" | "declined";
  name: string;
}

const LEVEL_COLORS: Record<string, string> = {
  Bronze: "text-amber-600",
  Silver: "text-gray-400",
  Gold: "text-yellow-500",
  Diamond: "text-cyan-400",
  Mastermind: "text-violet-400",
};

export function AccountabilityPartner() {
  const { user, supabase } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [myId, setMyId] = useState<string>("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState<{ user_id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadPartners() {
      if (!user) { setLoading(false); return; }
      setMyId(user.id);

      // Get accepted partner links
      const { data: links } = await supabase
        .from("accountability_partners")
        .select("*")
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .eq("status", "accepted");

      if (links && links.length > 0) {
        const partnerIds = links.map((l) =>
          l.from_user_id === user.id ? l.to_user_id : l.from_user_id
        );

        // Fetch partner profiles + streaks
        const partnerData: Partner[] = [];
        for (const pid of partnerIds) {
          const [profileRes, streakRes] = await Promise.all([
            supabase.from("profiles").select("name, avatar_url").eq("user_id", pid).maybeSingle(),
            supabase.from("streaks").select("current_streak").eq("user_id", pid).maybeSingle(),
          ]);
          if (profileRes.data) {
            partnerData.push({
              user_id: pid,
              name: profileRes.data.name || "Partner",
              avatar_url: profileRes.data.avatar_url,
              current_streak: streakRes.data?.current_streak ?? 0,
              level: "Bronze",
              last_active: new Date().toISOString(),
            });
          }
        }
        setPartners(partnerData);
      }

      // Get pending requests
      const { data: pending } = await supabase
        .from("accountability_partners")
        .select("*")
        .eq("to_user_id", user.id)
        .eq("status", "pending");

      if (pending) {
        const enriched: PartnerRequest[] = [];
        for (const req of pending) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("user_id", req.from_user_id)
            .maybeSingle();
          enriched.push({ ...req, name: profile?.name || "Someone" });
        }
        setRequests(enriched);
      }

      setLoading(false);
    }
    loadPartners();
  }, [user, supabase]);

  async function handleSearch() {
    if (!searchEmail.trim()) return;
    setSending(true);
    setMessage("");
    setSearchResult(null);

    const supabase = createClient();
    // Search by name (simplified — in production you'd search by email)
    const { data } = await supabase
      .from("profiles")
      .select("user_id, name")
      .ilike("name", `%${searchEmail}%`)
      .neq("user_id", myId)
      .limit(1)
      .maybeSingle();

    if (data) {
      setSearchResult(data);
    } else {
      setMessage("No user found with that name");
    }
    setSending(false);
  }

  async function sendRequest(toUserId: string) {
    setSending(true);
    const supabase = createClient();
    await supabase.from("accountability_partners").insert({
      from_user_id: myId,
      to_user_id: toUserId,
      status: "pending",
    });
    setMessage("Request sent!");
    setSearchResult(null);
    setSearchEmail("");
    setSending(false);
  }

  async function respondToRequest(requestId: string, accept: boolean) {
    const supabase = createClient();
    await supabase
      .from("accountability_partners")
      .update({ status: accept ? "accepted" : "declined" })
      .eq("id", requestId);
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    if (accept) window.location.reload();
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-4 space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Users className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-semibold">Accountability Partners</h2>
          <p className="text-xs text-muted-foreground">Train together, stay motivated</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px]"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={sending || !searchEmail.trim()}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 min-h-[44px] touch-manipulation active:scale-[0.97]"
        >
          <UserPlus className="h-4 w-4" />
        </button>
      </div>

      {searchResult && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-3">
          <span className="text-sm font-medium">{searchResult.name}</span>
          <button
            onClick={() => sendRequest(searchResult.user_id)}
            disabled={sending}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <UserPlus className="h-3 w-3" />
            Add
          </button>
        </div>
      )}

      {message && (
        <p className="mb-3 text-xs text-primary">{message}</p>
      )}

      {/* Pending requests */}
      {requests.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Requests</p>
          {requests.map((req) => (
            <div key={req.id} className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm font-medium">{req.name} wants to be your partner</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => respondToRequest(req.id, true)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => respondToRequest(req.id, false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Partner list */}
      {partners.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Partners</p>
          {partners.map((p) => (
            <div key={p.user_id} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 text-sm font-bold text-primary">
                {p.name[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">Last active today</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-orange-400">
                  <Flame className="h-3 w-3" />
                  {p.current_streak}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-muted/50 p-4 text-center">
          <Users className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            No partners yet. Invite a friend to train together!
          </p>
        </div>
      )}
    </div>
  );
}
