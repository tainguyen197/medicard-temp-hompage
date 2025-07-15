import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get counts from database
    const [
      totalServices,
      totalTeamMembers,
      totalMedia,
      totalBanners,
      totalEquipment,
    ] = await Promise.all([
      prisma.service.count(),
      prisma.teamMember.count(),
      prisma.media.count(),
      prisma.banner.count(),
      prisma.equipment.count(),
    ]);

    return NextResponse.json({
      stats: {
        totalServices,
        totalTeamMembers,
        totalMedia,
        totalBanners,
        totalEquipment,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
