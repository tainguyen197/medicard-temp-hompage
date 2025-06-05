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
import DeleteServiceModal from "./DeleteServiceModal";
import { ROUTES } from "@/lib/router";

interface Service {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: Date | string;
  shortDescription: string;
  featureImage?: {
    id: string;
    url: string;
    fileName?: string | null;
    originalName?: string | null;
  } | null;
}

interface ServiceTableRowProps {
  service: Service;
  formatDate: (date: Date | string) => string;
  onServiceDeleted?: () => void;
  onStatusChange?: (serviceId: string, newStatus: string) => Promise<void>;
}

export default function ServiceTableRow({
  service,
  formatDate,
  onServiceDeleted,
  onStatusChange,
}: ServiceTableRowProps) {
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
    if (onStatusChange && newStatus !== service.status) {
      setIsUpdating(true);
      try {
        await onStatusChange(service.id, newStatus);
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
                disabled={service.status === "PUBLISHED"}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  service.status === "PUBLISHED"
                    ? "bg-gray-100 text-gray-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <CheckCircle size={14} className="mr-2 text-green-600" />
                Published
              </button>
              <button
                onClick={() => handleStatusChange("DRAFT")}
                disabled={service.status === "DRAFT"}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  service.status === "DRAFT"
                    ? "bg-gray-100 text-gray-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Clock size={14} className="mr-2 text-yellow-600" />
                Draft
              </button>
              <button
                onClick={() => handleStatusChange("ARCHIVED")}
                disabled={service.status === "ARCHIVED"}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  service.status === "ARCHIVED"
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
    <tr key={service.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        <div className="flex items-center justify-center">
          {service.featureImage ? (
            <div className="w-16 aspect-[270/200] relative rounded-md overflow-hidden">
              <img
                src={service.featureImage.url}
                alt={service.title}
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
          <div className="text-sm font-medium text-gray-900">
            {service.title}
          </div>
          <div className="text-sm text-gray-500">/services/{service.slug}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-wrap text-sm text-gray-500">
        <span className="text-justify text-xs line-clamp-3">
          {service.shortDescription}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        {getStatusBadge(service.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-middle">
        {formatDate(service.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-middle">
        <Link
          href={ROUTES.ADMIN_SERVICES + `/${service.id}`}
          className="text-blue-600 hover:text-blue-900 mr-4"
        >
          Edit
        </Link>
        <Link
          href={ROUTES.SERVICES + `/${service.slug}`}
          target="_blank"
          className="text-gray-600 hover:text-gray-900 mr-4"
        >
          View
        </Link>
        <DeleteServiceModal
          service={{
            id: service.id,
            title: service.title,
          }}
          onServiceDeleted={onServiceDeleted}
        >
          <button className="text-red-600 hover:text-red-900">Delete</button>
        </DeleteServiceModal>
      </td>
    </tr>
  );
}
