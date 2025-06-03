import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Create a fresh Prisma client instance
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 }
      );
    }

    console.log(`Attempting to update service ${id} to status ${status}`);

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    console.log("Found service:", existingService);

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

    console.log("Updated service:", updatedService);

    return NextResponse.json({
      message: "Status updated successfully",
      service: updatedService,
    });
  } catch (error) {
    console.error("Error updating service status:", error);
    return NextResponse.json(
      { error: "Error updating service status", details: String(error) },
      { status: 500 }
    );
  } finally {
    // Disconnect the Prisma client to avoid connection leaks
    await prisma.$disconnect();
  }
}
