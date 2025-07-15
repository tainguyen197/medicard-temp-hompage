import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageContent } from "@/lib/utils";

interface Params {
  params: {
    id: string;
  };
}

// PATCH /api/equipment/[id]/status - Update equipment status
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    // Check authentication and permissions
    const session = await getServerSession(authOptions);
    if (!session?.user || !canManageContent(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the status from the request body
    const body = await req.json();
    const { status } = body;

    if (!status || !["ACTIVE", "INACTIVE"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Check if equipment exists
    const existingEquipment = await prisma.equipment.findUnique({
      where: { id: params.id },
    });

    if (!existingEquipment) {
      return NextResponse.json(
        { error: "Equipment not found" },
        { status: 404 }
      );
    }

    // Update equipment status
    const updatedEquipment = await prisma.equipment.update({
      where: { id: params.id },
      data: { status },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "UPDATE_STATUS",
        entity: "EQUIPMENT",
        entityId: updatedEquipment.id,
        userId: session.user.id,
        details: `Updated equipment status: ${existingEquipment.name} from ${existingEquipment.status} to ${status}`,
      },
    });

    return NextResponse.json({
      message: "Equipment status updated successfully",
      equipment: updatedEquipment,
    });
  } catch (error) {
    console.error("Error updating equipment status:", error);
    return NextResponse.json(
      { error: "Failed to update equipment status" },
      { status: 500 }
    );
  }
} 