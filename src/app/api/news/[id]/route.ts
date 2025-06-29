import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { createSlug } from "../../../../lib/utils";
import { Logger } from "../../../../lib/utils";

// Schema for news update
const newsUpdateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleEn: z.string().optional(),
  status: z.string().optional(),
  showOnHomepage: z.boolean().optional(),
  categoryId: z.string().optional(),
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

// GET /api/news/[id] - Get a single news article
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        featureImage: true,
        featureImageEn: true,
        category: true,
      },
    });

    if (!news) {
      return NextResponse.json(
        { error: "News article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news article:", error);
    return NextResponse.json(
      { error: "Error fetching news article" },
      { status: 500 }
    );
  }
}

// PUT /api/news/[id] - Update a news article
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
    const validatedData = newsUpdateSchema.parse(body);

    // Get existing news for comparison
    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: "News article not found" },
        { status: 404 }
      );
    }

    // Generate slug if not provided
    const slug = validatedData.slug || createSlug(validatedData.title);

    // Check if slug is being changed and if it already exists
    if (slug !== existingNews.slug) {
      const slugExists = await prisma.news.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A news article with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Check homepage limit if showOnHomepage is being set to true
    if (validatedData.showOnHomepage && !existingNews.showOnHomepage) {
      const homepageNewsCount = await prisma.news.count({
        where: { showOnHomepage: true },
      });

      if (homepageNewsCount >= 3) {
        return NextResponse.json(
          {
            error:
              "Maximum of 3 news articles can be shown on homepage. Please disable another news article first.",
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

    const news = await prisma.news.update({
      where: { id },
      data: {
        title: validatedData.title,
        titleEn: validatedData.titleEn,
        description: validatedData.description,
        descriptionEn: validatedData.descriptionEn,
        shortDescription: validatedData.shortDescription,
        shortDescriptionEn: validatedData.shortDescriptionEn,
        keywords: validatedData.keywords,
        enKeywords: validatedData.enKeywords,
        status: validatedData.status,
        ...(validatedData.showOnHomepage !== undefined && {
          showOnHomepage: validatedData.showOnHomepage,
        }),
        ...(validatedData.categoryId !== undefined && {
          categoryId: validatedData.categoryId,
        }),
        slug,
        metaTitle: validatedData.metaTitle,
        metaTitleEn: validatedData.metaTitleEn,
        metaDescription: validatedData.metaDescription,
        metaDescriptionEn: validatedData.metaDescriptionEn,
        metaKeywords: validatedData.metaKeywords,
        metaKeywordsEn: validatedData.metaKeywordsEn,
        ...(featureImageId && { featureImageId }), // Only add if we have an image ID
        ...(featureImageEnId && { featureImageEnId }), // Only add if we have an English image ID
      },
      include: {
        featureImage: true,
        featureImageEn: true,
        category: true,
      },
    });

    // Log the update with changes
    const changes: Record<string, any> = {};
    
    if (validatedData.title !== existingNews.title) {
      changes.title = { from: existingNews.title, to: validatedData.title };
    }
    if (validatedData.status !== existingNews.status) {
      changes.status = { from: existingNews.status, to: validatedData.status };
    }
    if (validatedData.showOnHomepage !== existingNews.showOnHomepage) {
      changes.showOnHomepage = { from: existingNews.showOnHomepage, to: validatedData.showOnHomepage };
    }
    if (validatedData.categoryId !== existingNews.categoryId) {
      changes.categoryId = { from: existingNews.categoryId, to: validatedData.categoryId };
    }

    await Logger.logCRUD({
      operation: 'UPDATE',
      entity: 'NEWS',
      entityId: news.id,
      userId: session.user.id,
      entityName: news.title,
      changes: Object.keys(changes).length > 0 ? changes : undefined,
    });

    return NextResponse.json(news);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating news article:", error);
    return NextResponse.json(
      { error: "Error updating news article" },
      { status: 500 }
    );
  }
}

// DELETE /api/news/[id] - Delete a news article
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

    // Get existing news for logging
    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: "News article not found" },
        { status: 404 }
      );
    }

    // Delete the news article
    await prisma.news.delete({
      where: { id },
    });

    // Log the deletion
    await Logger.logCRUD({
      operation: 'DELETE',
      entity: 'NEWS',
      entityId: id,
      userId: session.user.id,
      entityName: existingNews.title,
    });

    return NextResponse.json(
      { message: "News article deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting news article:", error);
    return NextResponse.json(
      { error: "Error deleting news article" },
      { status: 500 }
    );
  }
}
