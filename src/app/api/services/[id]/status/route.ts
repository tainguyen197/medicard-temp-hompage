import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import { Logger, canPublishContent } from "../../../../../lib/utils";

// Schema for status update
const statusUpdateSchema = z.object({
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]),
});

// PATCH /api/services/[id]/status - Update service status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate the request body
    const { status } = statusUpdateSchema.parse(body);

    // Check if user has permission to publish content
    if (status === "PUBLISHED" && !canPublishContent(session.user.role)) {
      return NextResponse.json(
        { error: "You do not have permission to publish content. Only Admins and Super Admins can publish." },
        { status: 403 }
      );
    }

    // Get existing service for logging
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Update the service status
    const updatedService = await prisma.service.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        title: true,
        status: true,
      },
    });

    // Log the status change
    await Logger.logStatusChange({
      entity: 'SERVICE',
      entityId: id,
      userId: session.user.id,
      entityName: existingService.title,
      previousStatus: existingService.status,
      newStatus: status,
    });

    return NextResponse.json({
      message: "Status updated successfully",
      service: updatedService,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating service status:", error);
    return NextResponse.json(
      { error: "Error updating service status" },
      { status: 500 }
    );
  }
}
