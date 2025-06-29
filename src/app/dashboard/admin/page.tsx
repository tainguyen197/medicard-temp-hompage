"use client";

import {
  Users,
  FileText,
  Flag,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Activity,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/router";

interface DashboardStats {
  totalServices: number;
  totalTeamMembers: number;
  totalMedia: number;
  totalBanners: number;
}

interface DashboardData {
  stats: DashboardStats;
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
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-96 bg-slate-200 rounded animate-pulse"></div>
        </div>

        {/* Stats grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
                <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
              </div>
              <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Welcome back to your admin dashboard.</p>
        </div>

        {/* Error State */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Dashboard</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { stats } = dashboardData;

  const statsConfig = [
    {
      label: "Services",
      value: stats.totalServices,
      icon: Flag,
      color: "blue",
      description: "Total services available",
      href: "/dashboard/admin/services"
    },
    {
      label: "Team Members",
      value: stats.totalTeamMembers,
      icon: Users,
      color: "green",
      description: "Active team members",
      href: "/dashboard/admin/team"
    },
    {
      label: "Media Files",
      value: stats.totalMedia,
      icon: FileText,
      color: "purple",
      description: "Files in media library",
      href: "/dashboard/admin/media"
    },
    {
      label: "Banners",
      value: stats.totalBanners,
      icon: BarChart3,
      color: "orange",
      description: "Active banner campaigns",
      href: "/dashboard/admin/banners"
    },
  ];

  const getIconBgColor = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600", 
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-600">
          Welcome back! Here's what's happening with your healthcare platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Link 
              key={stat.label}
              href={stat.href}
              className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  {stat.label}
                </h3>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconBgColor(stat.color)} group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <span>{stat.description}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
          <TrendingUp className="w-5 h-5 text-slate-400" />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link 
            href={ROUTES.ADMIN_SERVICES + "/new"}
            className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200 group"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
              <Flag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-slate-900">Add New Service</div>
              <div className="text-sm text-slate-600">Create a new healthcare service</div>
            </div>
          </Link>

          <Link 
            href={ROUTES.ADMIN_NEWS + "/new"}
            className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200 group"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-slate-900">Create News Article</div>
              <div className="text-sm text-slate-600">Publish latest news and updates</div>
            </div>
          </Link>

          <Link 
            href={ROUTES.ADMIN_TEAM + "/new"}
            className="flex items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200 group"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="font-medium text-slate-900">Add Team Member</div>
              <div className="text-sm text-slate-600">Add a new doctor or staff member</div>
            </div>
          </Link>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">System Status</h3>
            <p className="text-slate-600">All systems are running smoothly</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
