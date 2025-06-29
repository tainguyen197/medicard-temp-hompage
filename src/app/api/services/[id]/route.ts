import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { createSlug } from "../../../../lib/utils";
import { use } from "react";
import { Logger, canPublishContent } from "../../../../lib/utils";

// Schema for service update
const serviceUpdateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleEn: z.string().optional(),
  status: z.string().optional(),
  showOnHomepage: z.boolean().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  shortDescription: z.string().optional(),
  shortDescriptionEn: z.string().optional(),
  keywords: z.string().optional(),
  enKeywords: z.string().optional(),
  featuredImage: z.string().optional(), // Accept the image URL
  featureImageId: z.string().optional(),
  featuredImageEn: z.string().optional(), // Accept the English image URL
  featureImageEnId: z.string().optional(),
  metaTitle: z
    .string()
    .max(65, "Meta title must be 65 characters or less")
    .optional(),
  metaTitleEn: z
    .string()
    .max(65, "Meta title (English) must be 65 characters or less")
    .optional(),
  metaDescription: z
    .string()
    .max(155, "Meta description must be 155 characters or less")
    .optional(),
  metaDescriptionEn: z
    .string()
    .max(155, "Meta description (English) must be 155 characters or less")
    .optional(),
  metaKeywords: z.string().optional(),
  metaKeywordsEn: z.string().optional(),
});

interface MockService {
  id: string;
  title: string;
  slug: string;
  description: string;
  createdAt: Date;
  featureImage: {
    id: string;
    url: string;
    fileName: string;
    originalName: string;
  };
}

// GET /api/services/[id] - Get a single service
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        featureImage: true,
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Error fetching service" },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id] - Update a service
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = serviceUpdateSchema.parse(body);

    // Check if user has permission to publish content
    if (validatedData.status === "PUBLISHED" && !canPublishContent(session.user.role)) {
      return NextResponse.json(
        { error: "You do not have permission to publish content. Only Admins and Super Admins can publish." },
        { status: 403 }
      );
    }

    // Get existing service for comparison
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Generate slug if not provided
    const slug = validatedData.slug || createSlug(validatedData.title);

    // Check if slug is being changed and if it already exists
    if (slug !== existingService.slug) {
      const slugExists = await prisma.service.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A service with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Check homepage limit if showOnHomepage is being set to true
    if (
      validatedData.showOnHomepage === true &&
      !existingService.showOnHomepage &&
      validatedData.status === "PUBLISHED"
    ) {
      const homepageServicesCount = await prisma.service.count({
        where: {
          showOnHomepage: true,
          status: "PUBLISHED",
          id: { not: id }, // Exclude current service
        },
      });

      if (homepageServicesCount >= 4) {
        return NextResponse.json(
          {
            error:
              "Maximum of 4 services can be shown on homepage. Please disable another service first.",
          },
          { status: 400 }
        );
      }
    }

    // Find the media record if featuredImage URL is provided
    let featureImageId = validatedData.featureImageId;
    let featureImageEnId = validatedData.featureImageEnId;

    if (validatedData.featuredImage && !featureImageId) {
      // Try to find the media record by URL
      const media = await prisma.media.findFirst({
        where: { url: validatedData.featuredImage },
      });

      if (media) {
        featureImageId = media.id;
      }
    }

    if (validatedData.featuredImageEn && !featureImageEnId) {
      // Try to find the media record by URL for English image
      const mediaEn = await prisma.media.findFirst({
        where: { url: validatedData.featuredImageEn },
      });

      if (mediaEn) {
        featureImageEnId = mediaEn.id;
      }
    }

    // Prepare update data
    const updateData: any = {
      title: validatedData.title,
      titleEn: validatedData.titleEn,
      description: validatedData.description,
      descriptionEn: validatedData.descriptionEn,
      shortDescription: validatedData.shortDescription,
      shortDescriptionEn: validatedData.shortDescriptionEn,
      keywords: validatedData.keywords,
      enKeywords: validatedData.enKeywords,
      status: validatedData.status,
      slug,
      metaTitle: validatedData.metaTitle,
      metaTitleEn: validatedData.metaTitleEn,
      metaDescription: validatedData.metaDescription,
      metaDescriptionEn: validatedData.metaDescriptionEn,
      metaKeywords: validatedData.metaKeywords,
      metaKeywordsEn: validatedData.metaKeywordsEn,
      ...(featureImageId && { featureImageId }), // Only add if we have an image ID
      ...(featureImageEnId && { featureImageEnId }), // Only add if we have an English image ID
    };

    // Only update showOnHomepage if it's provided in the request
    if (validatedData.showOnHomepage !== undefined) {
      updateData.showOnHomepage = validatedData.showOnHomepage;
    }

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
      include: {
        featureImage: true,
        featureImageEn: true,
      },
    });

    // Log the update with changes
    const changes: Record<string, any> = {};
    
    if (validatedData.title !== existingService.title) {
      changes.title = { from: existingService.title, to: validatedData.title };
    }
    if (validatedData.status !== existingService.status) {
      changes.status = { from: existingService.status, to: validatedData.status };
    }
    if (validatedData.showOnHomepage !== existingService.showOnHomepage) {
      changes.showOnHomepage = { from: existingService.showOnHomepage, to: validatedData.showOnHomepage };
    }

    await Logger.logCRUD({
      operation: 'UPDATE',
      entity: 'SERVICE',
      entityId: service.id,
      userId: session.user.id,
      entityName: service.title,
      changes: Object.keys(changes).length > 0 ? changes : undefined,
    });

    return NextResponse.json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Error updating service" },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id] - Delete a service
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

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

    // Delete the service
    await prisma.service.delete({
      where: { id },
    });

    // Log the deletion
    await Logger.logCRUD({
      operation: 'DELETE',
      entity: 'SERVICE',
      entityId: id,
      userId: session.user.id,
      entityName: existingService.title,
    });

    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Error deleting service" },
      { status: 500 }
    );
  }
}
