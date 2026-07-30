"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InviteFriendsCard } from "@/components/dashboard/invite-friends-card";

export default function InvitePage() {
  return (
    <div className="mx-auto w-full max-w-full space-y-6 overflow-x-hidden px-4 sm:px-6 lg:px-0 touch-manipulation">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div>
        <h1 className="text-balance text-xl font-bold sm:text-2xl">Invite Friends</h1>
        <p className="text-sm text-muted-foreground">
          Share your invite link and earn 100 coins for each friend who joins!
        </p>
      </div>

      <InviteFriendsCard />
    </div>
  );
}
