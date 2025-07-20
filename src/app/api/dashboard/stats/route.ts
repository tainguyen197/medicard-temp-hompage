import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  canManageUsers, 
  canManageContent, 
  canViewAuditLogs,
  canAccessSystemSettings 
} from "@/lib/utils";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role;

    // Get counts from database based on user role
    const statsPromises = [];

    // Services - available to all roles
    statsPromises.push(prisma.service.count());

    // Team Members - only for ADMIN and SUPER_ADMIN
    if (canManageContent(userRole)) {
      statsPromises.push(prisma.teamMember.count());
    } else {
      statsPromises.push(Promise.resolve(0));
    }

    // Equipment - only for ADMIN and SUPER_ADMIN
    if (canManageContent(userRole)) {
      statsPromises.push(prisma.equipment.count());
    } else {
      statsPromises.push(Promise.resolve(0));
    }

    // Media - available to all roles
    statsPromises.push(prisma.media.count());

    // Banners - available to all roles
    statsPromises.push(prisma.banner.count());

    // Users - only for SUPER_ADMIN
    if (canManageUsers(userRole)) {
      statsPromises.push(prisma.user.count());
    } else {
      statsPromises.push(Promise.resolve(0));
    }

    // Audit Logs - only for ADMIN and SUPER_ADMIN
    if (canViewAuditLogs(userRole)) {
      statsPromises.push(prisma.auditLog.count());
    } else {
      statsPromises.push(Promise.resolve(0));
    }

    const [
      totalServices,
      totalTeamMembers,
      totalEquipment,
      totalMedia,
      totalBanners,
      totalUsers,
      totalLogs,
    ] = await Promise.all(statsPromises);

    return NextResponse.json({
      stats: {
        totalServices,
        totalTeamMembers,
        totalEquipment,
        totalMedia,
        totalBanners,
        totalUsers,
        totalLogs,
      },
      userRole,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
