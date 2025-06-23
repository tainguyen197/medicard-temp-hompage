import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

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
    if (!["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Check if media file exists
    const mediaFile = await prisma.media.findUnique({
      where: { id },
    });

    if (!mediaFile) {
      return NextResponse.json(
        { error: "Media file not found" },
        { status: 404 }
      );
    }

    // Check if media file is being used in any posts, services, team members, or banners
    const [
      postsUsingMedia,
      servicesUsingMedia,
      teamMembersUsingMedia,
      bannersUsingMedia,
    ] = await Promise.all([
      prisma.post.count({
        where: {
          OR: [{ featuredImageId: id }, { featuredImageEnId: id }],
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
      postsUsingMedia > 0 ||
      servicesUsingMedia > 0 ||
      teamMembersUsingMedia > 0 ||
      bannersUsingMedia > 0
    ) {
      return NextResponse.json(
        {
          error:
            "Cannot delete media file. It is currently being used in posts, services, team members, or banners.",
          details: {
            posts: postsUsingMedia,
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
