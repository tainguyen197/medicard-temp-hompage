import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// GET /api/news/featured - Get featured/trending news articles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5");

    // Get featured posts first
    const featuredPosts = await prisma.news.findMany({
      where: {
        status: "PUBLISHED",
        // Note: Add featured field to News model if needed
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        featureImage: true,
        featureImageEn: true,
        category: true,
      },
    });

    // If we don't have enough featured posts, supplement with most recent posts
    let posts = featuredPosts;
    if (featuredPosts.length < limit) {
      const recentPosts = await prisma.news.findMany({
        where: {
          status: "PUBLISHED",
          id: { notIn: featuredPosts.map((p: any) => p.id) }, // Exclude already selected featured posts
        },
        orderBy: { createdAt: "desc" },
        take: limit - featuredPosts.length,
        include: {
          featureImage: true,
          featureImageEn: true,
          category: true,
        },
      });

      posts = [...featuredPosts, ...recentPosts];
    }

    return NextResponse.json({
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error("Error fetching featured news:", error);
    return NextResponse.json(
      { error: "Error fetching featured news" },
      { status: 500 }
    );
  }
} 