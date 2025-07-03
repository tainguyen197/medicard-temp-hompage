"use client";

import { useState } from "react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface UsersTableRowProps {
  user: User;
  currentUserId: string;
  formatDate: (date: Date | string) => string;
  getRoleColor: (role: string) => string;
  getRoleLabel: (role: string) => string;
  onUserDeleted: (userId: string) => void;
  onUserUpdated: (user: User) => void;
}

export default function UsersTableRow({
  user,
  currentUserId,
  formatDate,
  getRoleColor,
  getRoleLabel,
  onUserDeleted,
  onUserUpdated,
}: UsersTableRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    email: user.email,
    name: user.name || "",
    role: user.role,
    password: "",
  });

  const handleEdit = async () => {
    try {
      const updateData: any = {
        email: editForm.email,
        name: editForm.name,
        role: editForm.role,
      };

      if (editForm.password) {
        updateData.password = editForm.password;
      }

      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update user");
      }

      const updatedUser = await response.json();
      onUserUpdated(updatedUser);
      setIsEditing(false);
      setEditForm({ ...editForm, password: "" }); // Clear password field
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        `Failed to update user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      onUserDeleted(user.id);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        `Failed to delete user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const isCurrentUser = user.id === currentUserId;

  if (isEditing) {
    return (
      <tr className="bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            disabled
            type="email"
            value={editForm.email}
            onChange={(e) =>
              setEditForm({ ...editForm, email: e.target.value })
            }
            className="w-full border rounded px-2 py-1 text-sm disabled:opacity-50"
            required
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            className="w-full border rounded px-2 py-1 text-sm"
            placeholder="Enter name"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <select
            disabled={isCurrentUser}
            value={editForm.role}
            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            className="w-full border rounded px-2 py-1 text-sm disabled:opacity-50"
          >
            <option value="EDITOR">Editor</option>
            <option value="ADMIN">Admin</option>
            {user.role === "SUPER_ADMIN" && (
              <option value="SUPER_ADMIN">Super Admin</option>
            )}
          </select>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(user.createdAt)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="password"
            value={editForm.password}
            onChange={(e) =>
              setEditForm({ ...editForm, password: e.target.value })
            }
            className="w-full border rounded px-2 py-1 text-sm"
            placeholder="New password (optional)"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
          <button
            onClick={handleEdit}
            className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2 py-1 rounded"
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditForm({
                email: user.email,
                name: user.name || "",
                role: user.role,
                password: "",
              });
            }}
            className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          >
            Cancel
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{user.email}</div>
        {isCurrentUser && (
          <div className="text-xs text-blue-600 font-medium">(You)</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.name || "—"}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
            user.role
          )}`}
        >
          {getRoleLabel(user.role)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(user.updatedAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 p-1 rounded"
          title="Edit user"
        >
          <PencilIcon size={16} />
        </button>
        {!isCurrentUser && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-1 rounded disabled:opacity-50"
            title="Delete user"
          >
            <TrashIcon size={16} />
          </button>
        )}
      </td>
    </tr>
  );
}
