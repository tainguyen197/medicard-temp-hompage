import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { Logger } from "../../../../lib/utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission (ADMIN or EDITOR)
    if (!["ADMIN", "EDITOR", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Get existing media file for logging
    const mediaFile = await prisma.media.findUnique({
      where: { id },
    });

    if (!mediaFile) {
      return NextResponse.json(
        { error: "Media file not found" },
        { status: 404 }
      );
    }

    // Check if media file is being used in any news, services, team members, or banners
    const [
      newsUsingMedia,
      servicesUsingMedia,
      teamMembersUsingMedia,
      bannersUsingMedia,
    ] = await Promise.all([
      prisma.news.count({
        where: {
          OR: [{ featureImageId: id }, { featureImageEnId: id }],
        },
      }),
      prisma.service.count({
        where: {
          OR: [{ featureImageId: id }, { featureImageEnId: id }],
        },
      }),
      prisma.teamMember.count({
        where: {
          OR: [{ imageId: id }, { imageEnId: id }],
        },
      }),
      prisma.banner.count({
        where: { imageId: id },
      }),
    ]);

    if (
      newsUsingMedia > 0 ||
      servicesUsingMedia > 0 ||
      teamMembersUsingMedia > 0 ||
      bannersUsingMedia > 0
    ) {
      return NextResponse.json(
        {
          error:
            "Cannot delete media file. It is currently being used in news, services, team members, or banners.",
          details: {
            news: newsUsingMedia,
            services: servicesUsingMedia,
            teamMembers: teamMembersUsingMedia,
            banners: bannersUsingMedia,
          },
        },
        { status: 409 }
      );
    }

    // Delete the media record from database
    await prisma.media.delete({
      where: { id },
    });

    // Log the deletion
    await Logger.logFileOperation({
      operation: "DELETE",
      entity: "MEDIA",
      entityId: id,
      userId: session.user.id,
      fileName: mediaFile.originalName || mediaFile.fileName || "Unknown file",
      fileSize: mediaFile.fileSize || 0,
      additionalDetails: `Deleted from media library`,
    });

    return NextResponse.json(
      { message: "Media file deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting media file:", error);
    return NextResponse.json(
      { error: "Error deleting media file" },
      { status: 500 }
    );
  }
}
