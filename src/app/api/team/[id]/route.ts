import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
      include: {
        image: true,
        imageEn: true,
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const nameEn = (formData.get("nameEn") as string) || null;
    const title = formData.get("title") as string;
    const titleEn = (formData.get("titleEn") as string) || null;
    const description = formData.get("description") as string;
    const descriptionEn = (formData.get("descriptionEn") as string) || null;
    const order = parseInt(formData.get("order") as string) || 0;
    const status = formData.get("status") as string;

    // Validate required fields
    if (!name || !title || !description) {
      return NextResponse.json(
        { error: "Name, title, and description are required" },
        { status: 400 }
      );
    }

    // Validate status
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Check if team member exists
    const existingTeamMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!existingTeamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // TODO: Handle file uploads for images
    // const imageFile = formData.get('imageFile') as File;
    // const imageEnFile = formData.get('imageEnFile') as File;

    const updatedTeamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        nameEn,
        title,
        titleEn,
        description,
        descriptionEn,
        order,
        status,
        // TODO: Add image handling
      },
      include: {
        image: true,
        imageEn: true,
      },
    });

    return NextResponse.json(updatedTeamMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if team member exists
    const existingTeamMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!existingTeamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Delete team member
    await prisma.teamMember.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
