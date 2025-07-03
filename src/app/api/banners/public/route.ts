import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/banners/public - Get banners for public pages (no auth required)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // Build where clause
    const where: any = {
      status: "ACTIVE", // Only return active banners
    };

    if (type) {
      where.type = type;
    }

    // Get banners with media relations
    const banners = await prisma.banner.findMany({
      where,
      include: {
        image: true,
      },
      orderBy: { type: "asc" },
    });

    return NextResponse.json({
      banners,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching public banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners", success: false },
      { status: 500 }
    );
  }
}
