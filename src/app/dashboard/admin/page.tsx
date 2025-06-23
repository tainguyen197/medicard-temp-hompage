"use client";

import {
  Users,
  FileText,
  Flag,
  ArrowUp,
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  totalPosts: number;
  totalServices: number;
  totalTeamMembers: number;
  totalMedia: number;
  totalBanners: number;
  postsTrend: number;
}

interface RecentPost {
  id: string;
  title: string;
  publishedAt: string;
  status: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentPosts: RecentPost[];
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    }
  };

  if (loading) {
    return (
      <div className=" text-black">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Loading dashboard data...</p>
        </header>
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" text-black">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-red-500 mt-1">{error}</p>
        </header>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { stats, recentPosts } = dashboardData;

  return (
    <div className="text-black">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back to your admin dashboard.
        </p>
      </header>

      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-500">Total Posts</h3>
            <span className="icon-circle">
              <FileText className="h-5 w-5" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalPosts}
            </div>
            <div
              className={`mt-1 ${
                stats.postsTrend > 0
                  ? "trend-up"
                  : stats.postsTrend < 0
                  ? "trend-down"
                  : "trend-same"
              }`}
            >
              {stats.postsTrend > 0 && <ArrowUp className="h-4 w-4 mr-1" />}
              {stats.postsTrend < 0 && <ArrowDown className="h-4 w-4 mr-1" />}
              <span>
                {stats.postsTrend > 0
                  ? `+${stats.postsTrend}`
                  : stats.postsTrend < 0
                  ? stats.postsTrend
                  : "0"}{" "}
                from last month
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-500">Services</h3>
            <span className="icon-circle">
              <Flag className="h-5 w-5" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalServices}
            </div>
            <div className="trend-same mt-1">
              <span>Total services</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-500">Team Members</h3>
            <span className="icon-circle">
              <Users className="h-5 w-5" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalTeamMembers}
            </div>
            <div className="trend-same mt-1">
              <span>Total team members</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-500">Media Files</h3>
            <span className="icon-circle">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" />
              </svg>
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalMedia}
            </div>
            <div className="trend-same mt-1">
              <span>Total media files</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-500">Banners</h3>
            <span className="icon-circle">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H9v2h6v-2h-2v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
              </svg>
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalBanners}
            </div>
            <div className="trend-same mt-1">
              <span>Total banners</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 mb-8">
        <div className="recent-posts">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-gray-900">
              Recent Posts
            </h3>
            <Link
              href="/dashboard/admin/posts"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </Link>
          </div>
          <div className="space-y-5">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="post-item">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {post.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {formatDate(post.publishedAt)}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          post.status === "PUBLISHED"
                            ? "bg-green-100 text-green-800"
                            : post.status === "DRAFT"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <Link
                      href={`/dashboard/admin/posts/${post.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No posts found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
