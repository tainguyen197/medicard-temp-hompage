import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// GET /api/news/featured - Get featured news articles (pinned ones)
export async function GET() {
  try {
    // Get published and pinned news articles
    // Limited to 5 items, ordered by creation date (newest first)
    const featuredNews = await prisma.news.findMany({
      where: {
        status: "PUBLISHED",
        pin: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        featureImage: true,
        featureImageEn: true,
        category: true,
        categoryEn: true,
      },
    });

    return NextResponse.json({
      posts: featuredNews,
      count: featuredNews.length,
    });
  } catch (error) {
    console.error("Error fetching featured news:", error);
    return NextResponse.json(
      { error: "Error fetching featured news" },
      { status: 500 }
    );
  }
} 