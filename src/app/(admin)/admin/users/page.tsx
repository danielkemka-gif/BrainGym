"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminUserTable } from "@/components/admin/admin-user-table";

interface User {
  user_id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  level: number;
  xp: number;
  is_premium: boolean;
  created_at: string;
  last_active: string | null;
  isAdmin?: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const pageSize = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      search,
    });
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users ?? []);
    setTotalCount(data.totalCount ?? 0);
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage {totalCount.toLocaleString()} registered users
        </p>
      </div>

      {loading && users.length === 0 ? (
        <div className="space-y-3 animate-pulse" role="status" aria-live="polite" aria-label="Loading users">
          <div className="h-10 w-full rounded-xl bg-muted" />
          <div className="h-96 w-full rounded-2xl bg-muted/50" />
        </div>
      ) : (
        <AdminUserTable
          users={users}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          search={search}
          onPageChange={setPage}
          onSearchChange={setSearch}
        />
      )}
    </div>
  );
}
