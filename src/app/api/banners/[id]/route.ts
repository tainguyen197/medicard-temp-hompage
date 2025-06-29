import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Logger } from "../../../../lib/utils";

// GET /api/banners/[id] - Get a specific banner
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const banner = await prisma.banner.findUnique({
      where: { id },
      include: {
        image: true,
      },
    });

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

// PUT /api/banners/[id] - Update a specific banner
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, link, imageId, status } = body;

    // Get existing banner for comparison
    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    // Validate type if provided
    if (type && !["HOMEPAGE", "SERVICE", "NEWS"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be HOMEPAGE, SERVICE, or NEWS" },
        { status: 400 }
      );
    }

    // If type is being changed, check if another banner with that type exists
    if (type && type !== existingBanner.type) {
      const conflictingBanner = await prisma.banner.findUnique({
        where: { type },
      });

      if (conflictingBanner) {
        return NextResponse.json(
          { error: `A banner with type ${type} already exists` },
          { status: 400 }
        );
      }
    }

    // Update banner
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...(type && { type }),
        link: link !== undefined ? link : undefined,
        imageId: imageId !== undefined ? imageId : undefined,
        status: status || undefined,
      },
      include: {
        image: true,
      },
    });

    // Log the update with changes
    const changes: Record<string, any> = {};
    
    if (type && type !== existingBanner.type) {
      changes.type = { from: existingBanner.type, to: type };
    }
    if (link !== existingBanner.link) {
      changes.link = { from: existingBanner.link, to: link };
    }
    if (status && status !== existingBanner.status) {
      changes.status = { from: existingBanner.status, to: status };
    }
    if (imageId !== existingBanner.imageId) {
      changes.imageId = { from: existingBanner.imageId, to: imageId };
    }

    await Logger.logCRUD({
      operation: 'UPDATE',
      entity: 'BANNER',
      entityId: banner.id,
      userId: session.user.id,
      entityName: `${banner.type} Banner`,
      changes: Object.keys(changes).length > 0 ? changes : undefined,
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

// DELETE /api/banners/[id] - Delete a specific banner
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get existing banner for logging
    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    // Delete the banner
    await prisma.banner.delete({
      where: { id },
    });

    // Log the deletion
    await Logger.logCRUD({
      operation: 'DELETE',
      entity: 'BANNER',
      entityId: id,
      userId: session.user.id,
      entityName: `${existingBanner.type} Banner`,
    });

    return NextResponse.json(
      { message: "Banner deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
