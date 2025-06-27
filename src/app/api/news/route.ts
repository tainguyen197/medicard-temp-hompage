import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { createSlug } from "../../../lib/utils";

// Schema for news creation/update
const newsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  shortDescription: z.string().optional(),
  shortDescriptionEn: z.string().optional(),
  keywords: z.string().optional(),
  enKeywords: z.string().optional(),
  status: z.string().optional().default("DRAFT"),
  slug: z.string().optional(),
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

// GET /api/news - Get all news with pagination
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search");
  const status = searchParams.get("status");

  // Build filter object
  const where: {
    status?: string;
    OR?: Array<{
      title?: { contains: string; mode: "insensitive" };
      titleEn?: { contains: string; mode: "insensitive" };
      description?: { contains: string; mode: "insensitive" };
      descriptionEn?: { contains: string; mode: "insensitive" };
    }>;
  } = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { titleEn: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { descriptionEn: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    // Get total count for pagination
    const total = await prisma.news.count({ where });

    // Get news with pagination
    const news = await prisma.news.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        featureImage: true, // Include the related Media record
      },
    });

    return NextResponse.json({
      news,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Error fetching news" }, { status: 500 });
  }
}

// POST /api/news - Create a new news article
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and has proper permissions
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = newsSchema.parse(body);

    // Generate slug if not provided
    const slug = validatedData.slug || createSlug(validatedData.title);

    // Check if slug already exists
    const existingNews = await prisma.news.findUnique({
      where: { slug },
    });

    if (existingNews) {
      return NextResponse.json(
        { error: "A news article with this slug already exists" },
        { status: 400 }
      );
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

    // Create the news article
    const news = await prisma.news.create({
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
      },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating news:", error);
    return NextResponse.json({ error: "Error creating news" }, { status: 500 });
  }
}
