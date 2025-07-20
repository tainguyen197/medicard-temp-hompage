import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageContent } from "@/lib/utils";

// GET /api/equipment - Get all equipment items
export async function GET(req: NextRequest) {
  try {
    const equipment = await prisma.equipment.findMany({
      orderBy: { order: "asc" },
      include: {
        image: true,
        imageEn: true,
      },
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json(
      { error: "Failed to fetch equipment" },
      { status: 500 }
    );
  }
}

// POST /api/equipment - Create a new equipment item
export async function POST(req: NextRequest) {
  try {
    // Check authentication and permissions
    const session = await getServerSession(authOptions);
    if (!session?.user || !canManageContent(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check total items limit (30)
    const totalEquipmentCount = await prisma.equipment.count();
    if (totalEquipmentCount >= 30) {
      return NextResponse.json(
        { error: "Maximum limit of 30 equipment items reached. Please delete some existing items first." },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    
    // Extract basic fields
    const name = formData.get("name") as string;
    const nameEn = formData.get("nameEn") as string;
    const description = formData.get("description") as string;
    const descriptionEn = formData.get("descriptionEn") as string;
    const status = formData.get("status") as string;
    const showOnHomepage = formData.get("showOnHomepage") === "true";
    const order = parseInt(formData.get("order") as string) || 0;
    
    // Handle image uploads
    const imageFile = formData.get("imageFile") as File | null;
    const imageEnFile = formData.get("imageEnFile") as File | null;
    
    let imageId = null;
    let imageEnId = null;
    
    // Process Vietnamese image if provided
    if (imageFile) {
      if (imageFile.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Vietnamese image must be smaller than 10MB." }, { status: 400 });
      }
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const uploadResponse = await fetch(`${baseUrl}/api/media/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "x-filename": imageFile.name,
        },
        body: buffer,
      });
      
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload Vietnamese image");
      }
      
      const uploadResult = await uploadResponse.json();
      imageId = uploadResult.id;
    }
    
    // Process English image if provided
    if (imageEnFile) {
      if (imageEnFile.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "English image must be smaller than 10MB." }, { status: 400 });
      }
      const bytes = await imageEnFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
      const uploadResponse = await fetch(`${baseUrl}/api/media/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "x-filename": imageEnFile.name,
        },
        body: buffer,
      });
      
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload English image");
      }
      
      const uploadResult = await uploadResponse.json();
      imageEnId = uploadResult.id;
    }
    
    // Create equipment record
    const equipment = await prisma.equipment.create({
      data: {
        name,
        nameEn,
        description,
        descriptionEn,
        status,
        showOnHomepage,
        order,
        imageId,
        imageEnId,
      },
      include: {
        image: true,
        imageEn: true,
      },
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "EQUIPMENT",
        entityId: equipment.id,
        userId: session.user.id,
        details: `Created equipment: ${name}`,
      },
    });
    
    return NextResponse.json(equipment, { status: 201 });
  } catch (error) {
    console.error("Error creating equipment:", error);
    return NextResponse.json(
      { error: "Failed to create equipment" },
      { status: 500 }
    );
  }
} 