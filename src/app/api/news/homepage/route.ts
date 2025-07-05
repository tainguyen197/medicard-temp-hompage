import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// GET /api/news/homepage - Get news articles for homepage (max 4)
export async function GET() {
  try {
    // Get published news articles that are marked to show on homepage
    // Limited to 4 items, ordered by pin status first, then creation date (newest first)
    const homepageNews = await prisma.news.findMany({
      where: {
        status: "PUBLISHED",
        showOnHomepage: true,
      },
      orderBy: [
        { pin: "desc" }, // Show pinned items first
        { createdAt: "desc" }
      ],
      take: 3,
      include: {
        featureImage: true,
        featureImageEn: true,
      },
    });

    return NextResponse.json({
      news: homepageNews,
      count: homepageNews.length,
    });
  } catch (error) {
    console.error("Error fetching homepage news:", error);
    return NextResponse.json(
      { error: "Error fetching homepage news" },
      { status: 500 }
    );
  }
}
