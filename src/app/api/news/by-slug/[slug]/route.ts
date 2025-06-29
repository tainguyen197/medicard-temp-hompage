import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

// GET /api/news/by-slug/[slug] - Get a single news article by slug (for marketing pages)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const news = await prisma.news.findFirst({
      where: { 
        slug,
        status: "PUBLISHED" // Only return published news for marketing pages
      },
      include: {
        featureImage: true,
        featureImageEn: true,
        category: true,
      },
    });

    if (!news) {
      return NextResponse.json(
        { error: "News article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news article by slug:", error);
    return NextResponse.json(
      { error: "Error fetching news article" },
      { status: 500 }
    );
  }
} 