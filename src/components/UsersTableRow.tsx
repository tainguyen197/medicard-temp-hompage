"use client";

import { useState } from "react";
import { PencilIcon, TrashIcon, X } from "lucide-react";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
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
      setShowDeleteModal(false);
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
    <>
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
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p>
                Are you sure you want to delete user{" "}
                <strong>{user.email}</strong>?
              </p>
            </div>
            <div className="px-4 py-3 flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
