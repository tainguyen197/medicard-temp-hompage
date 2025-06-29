"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import UsersTableRow from "@/components/UsersTableRow";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface UsersTableProps {
  users: User[];
  currentUserId: string;
}

export default function UsersTable({ users, currentUserId }: UsersTableProps) {
  const router = useRouter();
  const [localUsers, setLocalUsers] = useState<User[]>(users);

  // Update local users when props change
  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const handleUserDeleted = (userId: string) => {
    setLocalUsers((prev) => prev.filter((user) => user.id !== userId));
    toast.success("User deleted successfully");
    router.refresh();
  };

  const handleUserUpdated = (updatedUser: User) => {
    setLocalUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    toast.success("User updated successfully");
    router.refresh();
  };

  // Client-side date formatting function
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-red-100 text-red-800";
      case "ADMIN":
        return "bg-blue-100 text-blue-800";
      case "EDITOR":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case "SUPER_ADMIN":
        return "Super Admin";
      case "ADMIN":
        return "Admin";
      case "EDITOR":
        return "Editor";
      default:
        return role;
    }
  };

  return (
    <div className="bg-white rounded-md shadow overflow-x-auto">
      <div className="shadow border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {localUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No users found
                </td>
              </tr>
            ) : (
              localUsers.map((user) => (
                <UsersTableRow
                  key={user.id}
                  user={user}
                  currentUserId={currentUserId}
                  formatDate={formatDate}
                  getRoleColor={getRoleColor}
                  getRoleLabel={getRoleLabel}
                  onUserDeleted={handleUserDeleted}
                  onUserUpdated={handleUserUpdated}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 