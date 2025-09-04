import { redirect } from "next/navigation";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { authFetch } from "@/lib/auth-fetch";
import { ROUTES } from "@/lib/router";
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

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Client-side guard handles auth; SSR redirect to login
  // Fallback redirect for no token can be handled by client AdminGuard

  const { page = "1", limit = "10", search } = await searchParams;

  // Build filter object
  const where: any = {};
  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
    ];
  }

  // Fetch users from Nest API instead of Prisma
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search) params.set("search", search);
  const res = await authFetch(`/api/users?${params.toString()}`);
  if (!res.ok) {
    redirect("/dashboard");
  }
  const data = await res.json();
  const users = data.users ?? [];
  const total = data.meta?.total ?? 0;
  const totalPages = data.meta?.totalPages ?? 1;

  // Prepare pagination data
  const paginationData = {
    currentPage: Number(page),
    limit: Number(limit),
    total,
    totalPages,
    search: search || "",
  };

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
        users={users as User[]}
        currentUserId={""}
        pagination={paginationData}
      />
    </div>
  );
} 