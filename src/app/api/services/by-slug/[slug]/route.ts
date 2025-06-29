import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

// GET /api/services/by-slug/[slug] - Get a single service by slug (for marketing pages)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const service = await prisma.service.findFirst({
      where: { 
        slug,
        status: "PUBLISHED" // Only return published services for marketing pages
      },
      include: {
        featureImage: {
          select: {
            id: true,
            url: true,
            fileName: true,
            originalName: true,
          },
        },
        featureImageEn: {
          select: {
            id: true,
            url: true,
            fileName: true,
            originalName: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching service by slug:", error);
    return NextResponse.json(
      { error: "Error fetching service" },
      { status: 500 }
    );
  }
} 