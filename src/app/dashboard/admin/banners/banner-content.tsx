"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import BannerTable from "@/components/BannerTable";

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

export default function BannerContent() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/banners");

      if (!response.ok) {
        throw new Error("Failed to fetch banners");
      }

      const data = await response.json();
      setBanners(data.banners || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch banners"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Banners</h1>
          <Link
            href="/admin/banners/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            New Banner
          </Link>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading banners...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Banners</h1>
          <Link
            href="/admin/banners/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            New Banner
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={fetchBanners}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-gray-600 mt-1">
            Manage homepage, service, and news banners. Only one banner per type
            is allowed.
          </p>
        </div>
        <Link
          href="/admin/banners/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          New Banner
        </Link>
      </div>

      {/* Banners Table */}
      <div className="bg-white shadow rounded-lg">
        <BannerTable banners={banners} onUpdate={fetchBanners} />
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="font-medium text-blue-900 mb-2">Banner Types Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-3 rounded border">
            <span className="font-medium text-green-600">Homepage:</span>{" "}
            {banners.find((b) => b.type === "HOMEPAGE")
              ? "✓ Active"
              : "Not set"}
          </div>
          <div className="bg-white p-3 rounded border">
            <span className="font-medium text-blue-600">Service:</span>{" "}
            {banners.find((b) => b.type === "SERVICE") ? "✓ Active" : "Not set"}
          </div>
          <div className="bg-white p-3 rounded border">
            <span className="font-medium text-purple-600">News:</span>{" "}
            {banners.find((b) => b.type === "NEWS") ? "✓ Active" : "Not set"}
          </div>
          <div className="bg-white p-3 rounded border">
            <span className="font-medium text-orange-600">About:</span>{" "}
            {banners.find((b) => b.type === "ABOUT") ? "✓ Active" : "Not set"}
          </div>
        </div>
      </div>
    </div>
  );
}
