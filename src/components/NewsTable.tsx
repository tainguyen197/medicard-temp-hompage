"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import NewsTableRow from "@/components/NewsTableRow";
import { News } from "@/types/post";
import { formatDate, LANGUAGE_OPTIONS } from "@/utils/common";
import { authFetch } from "@/lib/auth-fetch";



interface NewsTableProps {
  news: News[];
}

export default function NewsTable({ news }: NewsTableProps) {
  const router = useRouter();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [localNews, setLocalNews] = useState<News[]>(news);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("vi");

  // Update local news when props change
  useEffect(() => {
    setLocalNews(news);
  }, [news]);

  const handleNewsDeleted = () => {
    router.refresh();
  };

  const handleStatusChange = async (newsId: string, newStatus: string) => {
    setUpdatingStatus(newsId);

    try {
      const response = await authFetch(`/api/news/${newsId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      // Update the local state immediately
      setLocalNews((prev) =>
        prev.map((article) =>
          article.id === newsId ? { ...article, status: newStatus } : article
        )
      );

      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        `Failed to update status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setUpdatingStatus(null);
    }
  };


  return (
    <div className="bg-white rounded-md shadow overflow-x-auto">
      <div className="flex items-center justify-end p-4">
        <label className="mr-2 text-sm font-medium">Language:</label>
        <select
          className="px-2 py-1 text-sm border rounded"
          value={selectedLanguage}
          onChange={e => setSelectedLanguage(e.target.value)}
        >
          {LANGUAGE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="shadow border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Homepage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pinned
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {localNews.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No news articles found
                </td>
              </tr>
            ) : (
              localNews.map((article) => (
                <NewsTableRow
                  loading={!!updatingStatus}
                  key={`${article.id}-${article.status}`}
                  news={article}
                  formatDate={formatDate}
                  onNewsDeleted={handleNewsDeleted}
                  onStatusChange={handleStatusChange}
                  selectedLanguage={selectedLanguage}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
