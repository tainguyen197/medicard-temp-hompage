import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    // Build where clause for search
    const where: any = {};

    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: "insensitive" } },
        { originalName: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count and media files
    const [total, mediaFiles] = await Promise.all([
      prisma.media.count({ where }),
      prisma.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    // Calculate total size in bytes and convert to MB
    const totalSizeResult = await prisma.media.aggregate({
      where,
      _sum: {
        fileSize: true,
      },
    });

    const totalSizeMB = totalSizeResult._sum.fileSize
      ? (totalSizeResult._sum.fileSize / (1024 * 1024)).toFixed(2)
      : "0.00";

    return NextResponse.json({
      mediaFiles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalSizeMB,
      },
    });
  } catch (error) {
    console.error("Error fetching media files:", error);
    return NextResponse.json(
      { error: "Error fetching media files" },
      { status: 500 }
    );
  }
}
