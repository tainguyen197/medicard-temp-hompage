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
  Stethoscope,
  Shield,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth-fetch";
import Link from "next/link";
import { ROUTES } from "@/lib/router";

interface DashboardStats {
  totalServices: number;
  totalTeamMembers: number;
  totalMedia: number;
  totalBanners: number;
  totalEquipment: number;
  totalUsers: number;
  totalLogs: number;
}

interface DashboardData {
  stats: DashboardStats;
  userRole: string;
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
        // 1) Fetch flat counts from Nest
        const statsRes = await authFetch("/api/dashboard/stats");
        if (!statsRes.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }
        const flat = await statsRes.json() as {
          users: number;
          news: number;
          services: number;
          equipment: number;
          team: number;
          banners: number;
          media: number;
          categories: number;
        };

        // 2) Fetch current user profile to determine role
        let role = "EDITOR";
        try {
          const profileRes = await authFetch("/api/auth/profile");
          if (profileRes.ok) {
            const user = await profileRes.json();
            role = user?.role || role;
          }
        } catch (_) {
          // ignore role fetch errors; default role remains
        }

        // 3) Map flat stats to UI structure
        const mapped: DashboardData = {
          stats: {
            totalServices: flat.services,
            totalTeamMembers: flat.team,
            totalMedia: flat.media,
            totalBanners: flat.banners,
            totalEquipment: flat.equipment,
            totalUsers: flat.users,
            totalLogs: 0,
          },
          userRole: role,
        };

        setDashboardData(mapped);
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

  console.log("dashboardData", dashboardData);

  const { stats, userRole } = dashboardData;

  // Define stats configuration based on user role
  const getStatsConfig = () => {
    const baseStats = [
      {
        label: "Services",
        value: stats.totalServices,
        icon: Flag,
        color: "blue",
        description: "Total services available",
        href: ROUTES.ADMIN_SERVICES,
        roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"]
      },
      {
        label: "Media Files",
        value: stats.totalMedia,
        icon: FileText,
        color: "purple",
        description: "Files in media library",
        href: ROUTES.ADMIN_MEDIA,
        roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"]
      },
      {
        label: "Banners",
        value: stats.totalBanners,
        icon: BarChart3,
        color: "orange",
        description: "Active banner campaigns",
        href: ROUTES.ADMIN_BANNERS,
        roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"]
      },
    ];

    // Add admin-only stats
    if (["SUPER_ADMIN", "ADMIN"].includes(userRole)) {
      baseStats.push(
        {
          label: "Team Members",
          value: stats.totalTeamMembers,
          icon: Users,
          color: "green",
          description: "Active team members",
          href: ROUTES.ADMIN_TEAM,
          roles: ["SUPER_ADMIN", "ADMIN"]
        },
        {
          label: "Equipment",
          value: stats.totalEquipment,
          icon: Stethoscope,
          color: "purple",
          description: "Medical equipment items",
          href: ROUTES.ADMIN_EQUIPMENT,
          roles: ["SUPER_ADMIN", "ADMIN"]
        }
      );
    }

    // Add super admin-only stats
    if (userRole === "SUPER_ADMIN") {
      baseStats.push(
        {
          label: "Users",
          value: stats.totalUsers,
          icon: Shield,
          color: "red",
          description: "System users",
          href: ROUTES.ADMIN_USERS,
          roles: ["SUPER_ADMIN"]
        },
        {
          label: "Audit Logs",
          value: stats.totalLogs,
          icon: Settings,
          color: "gray",
          description: "System activity logs",
          href: ROUTES.ADMIN_LOGS,
          roles: ["SUPER_ADMIN", "ADMIN"]
        }
      );
    }

    return baseStats.filter(stat => stat.roles.includes(userRole));
  };

  const statsConfig = getStatsConfig();

  const getIconBgColor = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600", 
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      red: "bg-red-100 text-red-600",
      gray: "bg-gray-100 text-gray-600",
    };
    return colors[color as keyof typeof colors];
  };

  // Define quick actions based on user role
  const getQuickActions = () => {
    const actions = [
      {
        label: "Add New Service",
        description: "Create a new healthcare service",
        href: ROUTES.ADMIN_SERVICES + "/new",
        icon: Flag,
        color: "blue",
        roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"]
      },
      {
        label: "Create News Article",
        description: "Publish latest news and updates",
        href: ROUTES.ADMIN_NEWS + "/new",
        icon: FileText,
        color: "green",
        roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"]
      },
    ];

    // Add admin-only actions
    if (["SUPER_ADMIN", "ADMIN"].includes(userRole)) {
      actions.push(
        {
          label: "Add Team Member",
          description: "Add a new doctor or staff member",
          href: ROUTES.ADMIN_TEAM + "/new",
          icon: Users,
          color: "purple",
          roles: ["SUPER_ADMIN", "ADMIN"]
        },
        {
          label: "Add Equipment",
          description: "Add new medical equipment",
          href: ROUTES.ADMIN_EQUIPMENT + "/new",
          icon: Stethoscope,
          color: "cyan",
          roles: ["SUPER_ADMIN", "ADMIN"]
        }
      );
    }

    return actions.filter(action => action.roles.includes(userRole));
  };

  const quickActions = getQuickActions();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-600">
          Welcome back! Here's what's happening with your healthcare platform.
        </p>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <span>Role:</span>
          <span className="px-2 py-1 bg-slate-100 rounded-md font-medium">
            {userRole}
          </span>
        </div>
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
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            
            // Define color classes based on action color
            const getColorClasses = (color: string) => {
              const colorMap = {
                blue: {
                  bg: "bg-blue-50 hover:bg-blue-100",
                  iconBg: "bg-blue-100",
                  iconColor: "text-blue-600"
                },
                green: {
                  bg: "bg-green-50 hover:bg-green-100",
                  iconBg: "bg-green-100",
                  iconColor: "text-green-600"
                },
                purple: {
                  bg: "bg-purple-50 hover:bg-purple-100",
                  iconBg: "bg-purple-100",
                  iconColor: "text-purple-600"
                },
                cyan: {
                  bg: "bg-cyan-50 hover:bg-cyan-100",
                  iconBg: "bg-cyan-100",
                  iconColor: "text-cyan-600"
                }
              };
              return colorMap[color as keyof typeof colorMap] || colorMap.blue;
            };
            
            const colorClasses = getColorClasses(action.color);
            
            return (
              <Link 
                key={action.label}
                href={action.href}
                className={`flex items-center p-4 ${colorClasses.bg} rounded-xl transition-colors duration-200 group`}
              >
                <div className={`w-10 h-10 ${colorClasses.iconBg} rounded-lg flex items-center justify-center mr-4 group-hover:bg-opacity-80 transition-colors`}>
                  <IconComponent className={`w-5 h-5 ${colorClasses.iconColor}`} />
                </div>
                <div>
                  <div className="font-medium text-slate-900">{action.label}</div>
                  <div className="text-sm text-slate-600">{action.description}</div>
                </div>
              </Link>
            );
          })}
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
