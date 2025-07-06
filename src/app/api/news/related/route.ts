import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// GET /api/news/related - Get related news articles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const currentNewsId = searchParams.get("currentNewsId");
    const limit = parseInt(searchParams.get("limit") || "3");

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Build filter object
    const where: {
      status: string;
      categoryId: string;
      id?: { not: string };
    } = {
      status: "PUBLISHED",
      categoryId,
    };

    // Exclude current news if provided
    if (currentNewsId) {
      where.id = { not: currentNewsId };
    }

    // Get related news articles
    const relatedNews = await prisma.news.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        featureImage: true,
        featureImageEn: true,
        category: true,
      },
    });

    return NextResponse.json({
      news: relatedNews,
      count: relatedNews.length,
    });
  } catch (error) {
    console.error("Error fetching related news:", error);
    return NextResponse.json(
      { error: "Error fetching related news" },
      { status: 500 }
    );
  }
} 