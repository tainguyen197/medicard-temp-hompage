import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // TODO: Handle file uploads for images
    // const imageFile = formData.get('imageFile') as File;
    // const imageEnFile = formData.get('imageEnFile') as File;

    const teamMember = await prisma.teamMember.create({
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
        // imageId: null,
        // imageEnId: null,
      },
      include: {
        image: true,
        imageEn: true,
      },
    });

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      include: {
        image: true,
        imageEn: true,
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
