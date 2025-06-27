"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  Archive,
  ChevronDown,
  MoreVertical,
} from "lucide-react";
import DeleteNewsModal from "./DeleteNewsModal";
import { ROUTES } from "@/lib/router";

interface News {
  id: string;
  title: string;
  slug: string;
  status: string;
  showOnHomepage?: boolean;
  createdAt: Date | string;
  shortDescription: string;
  featureImage?: {
    id: string;
    url: string;
    fileName?: string | null;
    originalName?: string | null;
  } | null;
}

interface NewsTableRowProps {
  news: News;
  formatDate: (date: Date | string) => string;
  onNewsDeleted?: () => void;
  onStatusChange?: (newsId: string, newStatus: string) => Promise<void>;
}

export default function NewsTableRow({
  news,
  formatDate,
  onNewsDeleted,
  onStatusChange,
}: NewsTableRowProps) {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const statusMenuRef = useRef<HTMLDivElement>(null);

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

  return (
    <tr key={news.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        <div className="flex items-center justify-center">
          {news.featureImage ? (
            <div className="w-16 aspect-[270/200] relative rounded-md overflow-hidden">
              <img
                src={news.featureImage.url}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 aspect-[270/200] bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500">
              No image
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        <div>
          <div className="text-sm font-medium text-gray-900">{news.title}</div>
          <div className="text-sm text-gray-500">/news/{news.slug}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-wrap text-sm text-gray-500">
        <span className="text-justify text-xs line-clamp-3">
          {news.shortDescription}
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
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-middle">
        {formatDate(news.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-middle">
        <Link
          href={ROUTES.ADMIN_NEWS + `/${news.id}`}
          className="text-blue-600 hover:text-blue-900 mr-4"
        >
          Edit
        </Link>
        <DeleteNewsModal
          news={{
            id: news.id,
            title: news.title,
          }}
          onNewsDeleted={onNewsDeleted}
        >
          <button className="text-red-600 hover:text-red-900 cursor-pointer">
            Delete
          </button>
        </DeleteNewsModal>
      </td>
    </tr>
  );
}
