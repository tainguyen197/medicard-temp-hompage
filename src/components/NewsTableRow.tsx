"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  Archive,
  ChevronDown,
} from "lucide-react";
import DeleteNewsModal from "./DeleteNewsModal";
import { ROUTES } from "@/lib/router";
import Image from "next/image";
import { News } from "@/types/post";
import { getLocalizedNews } from "@/utils/news";
import { useUserProfile } from "@/hooks/useUserProfile";
import { hasRequiredRole } from "@/lib/utils";

interface NewsTableRowProps {
  loading: boolean;
  news: News;
  formatDate: (date: Date | string) => string;
  onNewsDeleted?: () => void;
  onStatusChange?: (newsId: string, newStatus: string) => Promise<void>;
  selectedLanguage: string;
}

export default function NewsTableRow({
  loading,
  news,
  formatDate,
  onNewsDeleted,
  onStatusChange,
  selectedLanguage,
}: NewsTableRowProps) {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const statusMenuRef = useRef<HTMLDivElement>(null);
  const { user } = useUserProfile();

  // Handle click outside to close status dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusMenuRef.current &&
        !statusMenuRef.current.contains(event.target as Node)
      ) {
        setIsStatusMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    if (onStatusChange && newStatus !== news.status) {
      setIsUpdating(true);
      try {
        await onStatusChange(news.id, newStatus);
      } catch (error) {
        console.error("Failed to update status:", error);
      } finally {
        setIsUpdating(false);
      }
    }
    setIsStatusMenuOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PUBLISHED: {
        className: "bg-green-100 text-green-800 border border-green-200",
        icon: <CheckCircle size={14} className="mr-1" />,
        label: "Published",
      },
      DRAFT: {
        className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        icon: <Clock size={14} className="mr-1" />,
        label: "Draft",
      },
      ARCHIVED: {
        className: "bg-gray-100 text-gray-800 border border-gray-200",
        icon: <Archive size={14} className="mr-1" />,
        label: "Archived",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;

    return (
      <div className="relative" ref={statusMenuRef}>
        <button
          onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
          disabled={isUpdating}
          className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit ${
            config.className
          } ${onStatusChange ? "cursor-pointer hover:opacity-80" : ""} ${
            isUpdating ? "opacity-50" : ""
          }`}
        >
          {config.icon}
          {config.label}
          {onStatusChange && <ChevronDown size={14} className="ml-1" />}
        </button>

        {isStatusMenuOpen && onStatusChange && (
          <div className="absolute z-10 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200">
            <div className="py-1">
              <button
                onClick={() => handleStatusChange("PUBLISHED")}
                disabled={news.status === "PUBLISHED"}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  news.status === "PUBLISHED"
                    ? "bg-gray-100 text-gray-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <CheckCircle size={14} className="mr-2 text-green-600" />
                Published
              </button>
              <button
                onClick={() => handleStatusChange("DRAFT")}
                disabled={news.status === "DRAFT"}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  news.status === "DRAFT"
                    ? "bg-gray-100 text-gray-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Clock size={14} className="mr-2 text-yellow-600" />
                Draft
              </button>
              <button
                onClick={() => handleStatusChange("ARCHIVED")}
                disabled={news.status === "ARCHIVED"}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  news.status === "ARCHIVED"
                    ? "bg-gray-100 text-gray-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Archive size={14} className="mr-2 text-gray-600" />
                Archived
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const localizedNews = getLocalizedNews(news, selectedLanguage);

  // Permission checks
  const canEdit = user && hasRequiredRole(user.role, "EDITOR");
  const canDelete = user && hasRequiredRole(user.role, "ADMIN");

  return (
    <tr key={news.id} className={`hover:bg-gray-50 ${loading ? "opacity-50" : ""}`}>
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-16 aspect-[200/200] relative rounded-md overflow-hidden">
            <Image
              src={localizedNews.image}
              alt={localizedNews.title || ""}
              className="w-full h-full object-cover"
              fill
            />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        <div>
          <div className="text-sm font-medium text-gray-900">{localizedNews.title}</div>
          <div className="text-sm text-gray-500">/news/{localizedNews.slug}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-wrap text-sm text-gray-500">
        <span className="text-justify text-xs line-clamp-3">
          {localizedNews.shortDescription}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        {getStatusBadge(news.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        <div className="flex items-center">
          {news.showOnHomepage ? (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 rounded-full">
              Yes
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 rounded-full">
              No
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        <div className="flex items-center">
          {news.pin ? (
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-full flex items-center">
              📌 Pinned
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 rounded-full">
              No
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-middle">
        {formatDate(news.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-middle">
        <div className="flex items-center justify-end space-x-4">
          {canEdit && (
            <Link
              href={ROUTES.ADMIN_NEWS + `/${news.id}`}
              className="text-blue-600 hover:text-blue-900"
            >
              Edit
            </Link>
          )}
          {canDelete && (
            <DeleteNewsModal
              news={{
                id: news.id,
                title: localizedNews.title || "",
              }}
              onNewsDeleted={onNewsDeleted}
            >
              <button className="text-red-600 hover:text-red-900 cursor-pointer">
                Delete
              </button>
            </DeleteNewsModal>
          )}
          {!canEdit && !canDelete && (
            <span className="text-gray-400 text-sm">No actions available</span>
          )}
        </div>
      </td>
    </tr>
  );
}
