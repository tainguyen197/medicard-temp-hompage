import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { createSlug } from "../../../lib/utils";

// Schema for service creation/update
const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.string().optional().default("DRAFT"),
  slug: z.string().optional(),
  featureImageId: z.string().optional(),
});

// GET /api/services - Get all services with pagination
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search");

  // Build filter object
  const where: {
    OR?: Array<{
      title?: { contains: string; mode: string };
      description?: { contains: string; mode: string };
    }>;
  } = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    // Get total count for pagination
    const total = await prisma.service.count({ where });

    // Get services with pagination
    const services = await prisma.service.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        featureImage: true, // Include the related Media record
      },
    });

    return NextResponse.json({
      services,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Error fetching services" },
      { status: 500 }
    );
  }
}

// POST /api/services - Create a new service
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and has proper permissions
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = serviceSchema.parse(body);

    // Generate slug if not provided
    const slug = validatedData.slug || createSlug(validatedData.title);

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug },
    });

    if (existingService) {
      return NextResponse.json(
        { error: "A service with this slug already exists" },
        { status: 400 }
      );
    }

    // Create the service
    const service = await prisma.service.create({
      data: {
        ...validatedData,
        slug,
      },
      include: {
        featureImage: true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Error creating service" },
      { status: 500 }
    );
  }
} 