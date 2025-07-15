import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/equipment/homepage - Get equipment items for homepage
export async function GET(req: NextRequest) {
  try {
    const equipment = await prisma.equipment.findMany({
      where: {
        status: "ACTIVE",
        showOnHomepage: true,
      },
      orderBy: { order: "asc" },
      include: {
        image: true,
        imageEn: true,
      },
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching homepage equipment:", error);
    return NextResponse.json(
      { error: "Failed to fetch homepage equipment" },
      { status: 500 }
    );
  }
} 