"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  File,
  Calendar,
  User,
  HardDrive,
} from "lucide-react";
import { toast } from "sonner";

interface MediaFile {
  id: string;
  url: string;
  fileName: string | null;
  originalName: string | null;
  fileType: string | null;
  fileSize: number | null;
  createdAt: string;
  uploadedBy: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

interface MediaMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalSizeMB: string;
}

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
};

export default function MediaContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [meta, setMeta] = useState<MediaMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [params, setParams] = useState<SearchParams>({
    page: "1",
    limit: "10",
    search: "",
  });

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await searchParams;
      setParams(resolvedParams);
      setSearchTerm(resolvedParams.search || "");
    };
    loadParams();
  }, [searchParams]);

  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.set("page", params.page);
      if (params.limit) searchParams.set("limit", params.limit);
      if (params.search) searchParams.set("search", params.search);

      const response = await fetch(`/api/media?${searchParams}`);

      if (!response.ok) {
        throw new Error("Failed to fetch media files");
      }

      const data = await response.json();
      setMediaFiles(data.mediaFiles);
      setMeta(data.meta);
    } catch (error) {
      console.error("Error fetching media files:", error);
      toast.error("Failed to load media files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(params).length > 0) {
      fetchMediaFiles();
    }
  }, [params]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = { ...params, search: searchTerm, page: "1" };
    const url = new URL(window.location.href);
    url.searchParams.set("search", searchTerm);
    url.searchParams.set("page", "1");
    window.history.pushState({}, "", url.toString());
    setParams(newParams);
  };

  const handleDelete = async (id: string, fileName: string | null) => {
    if (
      !confirm(`Are you sure you want to delete "${fileName || "this file"}"?`)
    ) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete media file");
      }

      toast.success("Media file deleted successfully");
      fetchMediaFiles(); // Refresh the list
    } catch (error) {
      console.error("Error deleting media file:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete media file"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isImageFile = (fileType: string | null) => {
    return fileType?.startsWith("image/") || false;
  };

  const getFileIcon = (fileType: string | null) => {
    if (isImageFile(fileType)) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading media files...</div>
      </div>
    );
  }

  return (
    <>
      {/* Stats Banner */}
      {meta && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium text-blue-800 flex items-center">
                <HardDrive className="mr-2" size={18} />
                Media Library Statistics
              </h2>
              <p className="text-sm text-blue-700 mt-1">
                Total {meta.total} files • {meta.totalSizeMB} MB used of 500 MB
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Tip: Delete old images to free up space if you need to stay
                within the 500 MB limit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
      </form>

      {/* Media Grid */}
      {mediaFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mediaFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 group relative overflow-hidden"
            >
              {/* Delete Button - Shows on Hover */}
              <button
                onClick={() => handleDelete(file.id, file.originalName)}
                disabled={deletingId === file.id}
                className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
                title="Delete file"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {/* File Preview */}
              <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center overflow-hidden">
                {isImageFile(file.fileType) ? (
                  <img
                    src={file.url}
                    alt={file.originalName || "Media file"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  getFileIcon(file.fileType)
                )}
              </div>

              {/* File Info */}
              <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm truncate mb-1">
                  {file.originalName || file.fileName || "Untitled"}
                </h3>

                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex items-center">
                    <File className="h-3 w-3 mr-1" />
                    {formatFileSize(file.fileSize)}
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(file.createdAt)}
                  </div>

                  {file.uploadedBy && (
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {file.uploadedBy.name || file.uploadedBy.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No media files found
          </h3>
          <p className="text-gray-500">
            {params.search
              ? "Try adjusting your search terms"
              : "Upload some files to get started"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-gray-700">
            Showing {(meta.page - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} files
          </div>

          <div className="flex gap-2">
            {meta.page > 1 && (
              <Link
                href={`?page=${meta.page - 1}&limit=${meta.limit}${
                  params.search
                    ? `&search=${encodeURIComponent(params.search)}`
                    : ""
                }`}
                className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
                Previous
              </Link>
            )}

            {meta.page < meta.totalPages && (
              <Link
                href={`?page=${meta.page + 1}&limit=${meta.limit}${
                  params.search
                    ? `&search=${encodeURIComponent(params.search)}`
                    : ""
                }`}
                className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Next
                <ChevronRight size={16} />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
