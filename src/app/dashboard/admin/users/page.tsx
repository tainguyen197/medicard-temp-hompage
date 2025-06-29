import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
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
  // Check authentication - server side only
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Only SUPER_ADMIN can access user management
  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const { page = "1", limit = "10", search } = await searchParams;

  // Build filter object
  const where: any = {};
  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
    ];
  }

  // Get users with pagination - server side only
  const total = await prisma.user.count({ where });
  const totalPages = Math.ceil(total / Number(limit));

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

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
        currentUserId={session.user.id}
        pagination={paginationData}
      />
    </div>
  );
} 