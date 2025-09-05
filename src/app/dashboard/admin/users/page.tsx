"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authFetch } from "@/lib/auth-fetch";
import UsersList from "./UsersList";

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
};

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    search: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resolvedParams = await searchParams;
        const { page = "1", limit = "10", search } = resolvedParams;

        // Fetch users from Nest API
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (search) params.set("search", search);
        
        const res = await authFetch(`/api/users?${params.toString()}`);
        if (!res.ok) {
          router.push("/dashboard");
          return;
        }
        const data = await res.json();
        setUsers(data.users ?? []);
        
        const total = data.meta?.total ?? 0;
        const totalPages = data.meta?.totalPages ?? 1;
        
        setPaginationData({
          currentPage: Number(page),
          limit: Number(limit),
          total,
          totalPages,
          search: search || "",
        });
      } catch (err) {
        setError("Failed to load users");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <div className="text-center py-12">
          <div className="text-slate-600">Loading users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-red-600 mb-2">Error</div>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <div>
          <h2 className="font-medium text-blue-800">User Management</h2>
          <p className="text-sm text-blue-700 mt-1">
            Manage user accounts and permissions. Only Super Admins can create, edit, and delete users.
          </p>
        </div>
      </div>

      {/* Pass data to client component */}
      <UsersList 
        users={users}
        currentUserId={""}
        pagination={paginationData}
      />
    </div>
  );
} 