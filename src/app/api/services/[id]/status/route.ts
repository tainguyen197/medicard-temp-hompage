import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";

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

    // Try to use the service model directly
    try {
      // Check if service exists
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
      await prisma.auditLog.create({
        data: {
          action: "UPDATE_STATUS",
          entity: "SERVICE",
          entityId: id,
          userId: session.user.id,
          details: JSON.stringify({
            previousStatus: existingService.status,
            newStatus: status,
          }),
        },
      });

      return NextResponse.json({
        message: "Status updated successfully",
        service: updatedService,
      });
    } catch (prismaError) {
      console.error("Prisma error:", prismaError);

      // Fallback to raw SQL if Prisma model access fails
      try {
        // Check if service exists with raw query
        const services = await prisma.$queryRaw`
          SELECT * FROM Service WHERE id = ${id}
        `;

        if (!services || (services as any[]).length === 0) {
          return NextResponse.json(
            { error: "Service not found" },
            { status: 404 }
          );
        }

        const existingService = (services as any[])[0];

        // Update service with raw query
        await prisma.$executeRaw`
          UPDATE Service 
          SET status = ${status}
          WHERE id = ${id}
        `;

        // Log the status change
        await prisma.auditLog.create({
          data: {
            action: "UPDATE_STATUS",
            entity: "SERVICE",
            entityId: id,
            userId: session.user.id,
            details: JSON.stringify({
              previousStatus: existingService.status,
              newStatus: status,
            }),
          },
        });

        return NextResponse.json({
          message: "Status updated successfully (raw SQL)",
          service: {
            id,
            title: existingService.title,
            status,
          },
        });
      } catch (rawError) {
        console.error("Raw SQL error:", rawError);
        throw rawError;
      }
    }
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
