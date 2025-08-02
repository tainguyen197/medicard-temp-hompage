import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageContent } from "@/lib/utils";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/equipment/[id] - Get a single equipment item
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id: (await params).id },
      include: {
        image: true,
        imageEn: true,
      },
    });

    if (!equipment) {
      return NextResponse.json(
        { error: "Equipment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json(
      { error: "Failed to fetch equipment" },
      { status: 500 }
    );
  }
}

// PUT /api/equipment/[id] - Update an equipment item
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    // Check authentication and permissions
    const session = await getServerSession(authOptions);
    if (!session?.user || !canManageContent(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if equipment exists
    const existingEquipment = await prisma.equipment.findUnique({
      where: { id: (await params).id },
    });

    if (!existingEquipment) {
      return NextResponse.json(
        { error: "Equipment not found" },
        { status: 404 }
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
    
    // Handle image uploads/updates
    const imageFile = formData.get("imageFile") as File | null;
    const imageEnFile = formData.get("imageEnFile") as File | null;
    const imageId = formData.get("imageId") as string || undefined;
    const imageEnId = formData.get("imageEnId") as string || undefined;
      
      console.log("Received form data:", { 
        imageId, 
        imageEnId, 
        imageEnIdType: typeof imageEnId,
        imageEnIdLength: imageEnId?.length,
        imageEnIdEmpty: imageEnId === ""
      });
    
    let updatedImageId = existingEquipment.imageId;
    let updatedImageEnId = existingEquipment.imageEnId;
    
    // Handle image removal (empty string means remove)
    if (imageId === "" || imageId === undefined) {
      updatedImageId = null;
    } else if (imageId) {
      updatedImageId = imageId;
    }
    
    if (imageEnId === "" || imageEnId === undefined) {
      updatedImageEnId = null;
    } else if (imageEnId) {
      updatedImageEnId = imageEnId;
    }
    
    // Process Vietnamese image if provided
    if (imageFile) {
      if (imageFile.size > 2 * 1024 * 1024) {
        return NextResponse.json({ error: "Vietnamese image must be smaller than 2MB." }, { status: 400 });
      }
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ;
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
      updatedImageId = uploadResult.id;
    }
    
    // Process English image if provided
    if (imageEnFile) {
      if (imageEnFile.size > 2 * 1024 * 1024) {
        return NextResponse.json({ error: "English image must be smaller than 2MB." }, { status: 400 });
      }
      const bytes = await imageEnFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
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
      updatedImageEnId = uploadResult.id;
    }
    
    
    // Update equipment record
    const updatedEquipment = await prisma.equipment.update({
      where: { id: (await params).id },
      data: {
        name,
        nameEn,
        description,
        descriptionEn,
        status,
        showOnHomepage,
        order,
        imageId: updatedImageId,
        imageEnId: updatedImageEnId,
      },
      include: {
        image: true,
        imageEn: true,
      },
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "EQUIPMENT",
        entityId: updatedEquipment.id,
        userId: session.user.id,
        details: `Updated equipment: ${name}`,
      },
    });
    
    return NextResponse.json(updatedEquipment);
  } catch (error) {
    console.error("Error updating equipment:", error);
    return NextResponse.json(
      { error: "Failed to update equipment" },
      { status: 500 }
    );
  }
}

// DELETE /api/equipment/[id] - Delete an equipment item
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    // Check authentication and permissions
    const session = await getServerSession(authOptions);
    if (!session?.user || !canManageContent(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if equipment exists
    const existingEquipment = await prisma.equipment.findUnique({
      where: { id: (await params).id },
    });

    if (!existingEquipment) {
      return NextResponse.json(
        { error: "Equipment not found" },
        { status: 404 }
      );
    }

    // Delete equipment record
    await prisma.equipment.delete({
      where: { id: (await params).id },
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entity: "EQUIPMENT",
        entityId: (await params).id,
        userId: session.user.id,
        details: `Deleted equipment: ${existingEquipment.name}`,
      },
    });
    
    return NextResponse.json({ message: "Equipment deleted successfully" });
  } catch (error) {
    console.error("Error deleting equipment:", error);
    return NextResponse.json(
      { error: "Failed to delete equipment" },
      { status: 500 }
    );
  }
} 