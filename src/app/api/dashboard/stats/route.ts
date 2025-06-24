import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get counts for all statistics
    const [servicesCount, teamMembersCount, mediaCount, bannerCount] =
      await Promise.all([
        // Count total services
        prisma.service.count(),

        // Count total team members
        prisma.teamMember.count(),

        // Count total media files
        prisma.media.count(),

        // Count total banners
        prisma.banner.count(),
      ]);

    return NextResponse.json({
      stats: {
        totalServices: servicesCount,
        totalTeamMembers: teamMembersCount,
        totalMedia: mediaCount,
        totalBanners: bannerCount,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Error fetching dashboard statistics" },
      { status: 500 }
    );
  }
}
