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
    const [
      postsCount,
      servicesCount,
      teamMembersCount,
      mediaCount,
      bannerCount,
      recentPosts,
    ] = await Promise.all([
      // Count total posts
      prisma.post.count(),

      // Count total services
      prisma.service.count(),

      // Count total team members
      prisma.teamMember.count(),

      // Count total media files
      prisma.media.count(),

      // Count total banners
      prisma.banner.count(),

      // Get recent posts (last 5)
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          publishedAt: true,
          createdAt: true,
          status: true,
        },
      }),
    ]);

    // Get published posts count for this month
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const startOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );

    const [currentMonthPosts, lastMonthPosts] = await Promise.all([
      prisma.post.count({
        where: {
          status: "PUBLISHED",
          publishedAt: {
            gte: startOfMonth,
          },
        },
      }),
      prisma.post.count({
        where: {
          status: "PUBLISHED",
          publishedAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      }),
    ]);

    // Calculate trends
    const postsTrend = currentMonthPosts - lastMonthPosts;

    return NextResponse.json({
      stats: {
        totalPosts: postsCount,
        totalServices: servicesCount,
        totalTeamMembers: teamMembersCount,
        totalMedia: mediaCount,
        totalBanners: bannerCount,
        postsTrend,
      },
      recentPosts: recentPosts.map((post) => ({
        id: post.id,
        title: post.title,
        publishedAt: post.publishedAt || post.createdAt,
        status: post.status,
      })),
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Error fetching dashboard statistics" },
      { status: 500 }
    );
  }
}
