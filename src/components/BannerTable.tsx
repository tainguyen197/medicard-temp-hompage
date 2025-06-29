"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, ExternalLink } from "lucide-react";

interface Banner {
  id: string;
  type: string;
  link?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  image?: {
    id: string;
    url: string;
    filename: string;
  };
}

interface BannerTableProps {
  banners: Banner[];
  onUpdate: () => void;
}

export default function BannerTable({ banners, onUpdate }: BannerTableProps) {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const getBannerTypeLabel = (type: string) => {
    switch (type) {
      case "HOMEPAGE":
        return "Homepage";
      case "SERVICE":
        return "Service";
      case "NEWS":
        return "News";
      case "ABOUT":
        return "About";
      default:
        return type;
    }
  };

  const getBannerTypeColor = (type: string) => {
    switch (type) {
      case "HOMEPAGE":
        return "bg-green-100 text-green-800";
      case "SERVICE":
        return "bg-blue-100 text-blue-800";
      case "NEWS":
        return "bg-purple-100 text-purple-800";
      case "ABOUT":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the ${getBannerTypeLabel(
          type
        ).toLowerCase()} banner?`
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete banner");
      }

      alert("Banner deleted successfully");
      onUpdate();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error instanceof Error ? error.message : "Failed to delete banner");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/banners/${id}/edit`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (banners.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No banners found</p>
        <p className="text-gray-400 text-sm mt-2">
          Create your first banner to get started
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Link
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Updated
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {banners.map((banner) => (
            <tr key={banner.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {banner.image ? (
                  <div className="relative h-12 w-20 rounded-md overflow-hidden">
                    <Image
                      src={banner.image.url}
                      alt={`${getBannerTypeLabel(banner.type)} banner`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-20 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-xs text-gray-400">No image</span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBannerTypeColor(
                    banner.type
                  )}`}
                >
                  {getBannerTypeLabel(banner.type)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {banner.link ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 truncate max-w-[200px]">
                      {banner.link}
                    </span>
                    <Link
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">No link</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    banner.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {banner.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-600">
                  {formatDate(banner.createdAt)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-600">
                  {formatDate(banner.updatedAt)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(banner.id)}
                    className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                    title="Edit banner"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id, banner.type)}
                    disabled={deleteLoading === banner.id}
                    className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                    title="Delete banner"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
