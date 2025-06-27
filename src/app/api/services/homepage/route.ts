import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// GET /api/services/homepage - Get services for homepage display
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: {
        showOnHomepage: true,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        titleEn: true,
        slug: true,
        shortDescription: true,
        shortDescriptionEn: true,
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
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 4, // Maximum 4 services for homepage
    });

    return NextResponse.json({
      services,
      count: services.length,
    });
  } catch (error) {
    console.error("Error fetching homepage services:", error);
    return NextResponse.json(
      { error: "Failed to fetch homepage services" },
      { status: 500 }
    );
  }
}
