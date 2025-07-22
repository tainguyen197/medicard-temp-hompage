import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// GET /api/news/related - Get related news articles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const currentNewsId = searchParams.get("currentNewsId");
    const limit = parseInt(searchParams.get("limit") || "3");
    const locale = searchParams.get("locale") || "vi";

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Build filter object based on locale
    const where: {
      status: string;
      id?: { not: string };
      OR?: Array<{
        categoryId?: string;
        categoryEnId?: string;
      }>;
    } = {
      status: "PUBLISHED",
    };

    // Exclude current news if provided
    if (currentNewsId) {
      where.id = { not: currentNewsId };
    }

    // Filter by appropriate category based on locale
    if (locale === "en") {
      where.OR = [
        { categoryEnId: categoryId },
        { categoryId: categoryId } 
      ];
    } else {
      where.OR = [
        { categoryId: categoryId }
      ];
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
        categoryEn: true,
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