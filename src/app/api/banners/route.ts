import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/banners - List all banners (should only be 3 max: homepage, service, news)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";

    // Build where clause
    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    // Get banners with media relations
    const banners = await prisma.banner.findMany({
      where,
      include: {
        image: true,
      },
      orderBy: { type: "asc" }, // Homepage, News, Service alphabetical order
    });

    return NextResponse.json({
      banners,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: banners.length,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

// POST /api/banners - Create or update banner (upsert by type)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, link, imageId, status } = body;

    // Validate required fields
    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    // Validate type
    if (!["HOMEPAGE", "SERVICE", "NEWS"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be HOMEPAGE, SERVICE, or NEWS" },
        { status: 400 }
      );
    }

    // Use upsert to replace existing banner of same type or create new one
    const banner = await prisma.banner.upsert({
      where: { type },
      update: {
        link: link || null,
        imageId: imageId || null,
        status: status || "ACTIVE",
      },
      create: {
        type,
        link: link || null,
        imageId: imageId || null,
        status: status || "ACTIVE",
      },
      include: {
        image: true,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Error creating/updating banner:", error);
    return NextResponse.json(
      { error: "Failed to save banner" },
      { status: 500 }
    );
  }
}
