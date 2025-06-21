import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { createSlug, extractImagesFromContentServer } from "../../../lib/utils";

// Schema for post creation/update
const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleEn: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  contentEn: z.string().optional(),
  excerpt: z.string().optional(),
  excerptEn: z.string().optional(),
  featuredImage: z.string().optional(),
  featuredImageId: z.string().optional(),
  featuredImageEn: z.string().optional(),
  featuredImageEnId: z.string().optional(),
  status: z.enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED", "SCHEDULED"]),
  publishedAt: z.string().optional(),
  categories: z.array(z.string()).optional(),
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
  slug: z.string().optional(),
});

// GET /api/posts - Get all posts with pagination, filtering, etc.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  console.log("API Request params:", searchParams);
  // Parse query parameters
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status");
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");

  console.log("API Request params:", {
    page,
    limit,
    status: status || "null",
    categoryId: categoryId || "null",
    search: search || "null",
  });

  // Build filter object
  const where: {
    status?: string;
    OR?: Array<{
      title?: { contains: string; mode: "insensitive" };
      content?: { contains: string; mode: "insensitive" };
    }>;
    categories?: { some: { categoryId: string } };
  } = {};

  if (status) {
    where.status = status;
    console.log(`Filtering by status: "${status}"`);
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categories = {
      some: {
        categoryId,
      },
    };
  }

  console.log("Query filter:", JSON.stringify(where));

  try {
    // First check how many posts of each status exist
    const statusCounts = await prisma.$queryRaw`
      SELECT status, COUNT(*) as count
      FROM Post
      GROUP BY status
    `;
    console.log("Posts by status:", statusCounts);

    // Get total count for pagination
    const total = await prisma.post.count({ where });
    console.log(`Total matching posts: ${total}`);

    // Get posts with pagination
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    console.log(`Returning ${posts.length} posts`);

    // Debug the statuses of returned posts
    const returnedStatuses = posts.map((post) => post.status);
    console.log("Returned post statuses:", returnedStatuses);

    return NextResponse.json({
      posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = postSchema.parse(body);

    // Generate slug if not provided
    const slug = validatedData.slug || createSlug(validatedData.title);

    // Extract categories, translation fields, and featured images
    const {
      categories,
      titleEn,
      contentEn,
      excerptEn,
      featuredImageId,
      featuredImageEnId,
      ...postData
    } = validatedData;

    // Find media records for featured images if URLs are provided
    let featuredImageIdToUse = featuredImageId;
    let featuredImageEnIdToUse = featuredImageEnId;

    if (validatedData.featuredImage && !featuredImageIdToUse) {
      const media = await prisma.media.findFirst({
        where: { url: validatedData.featuredImage },
      });
      if (media) {
        featuredImageIdToUse = media.id;
      }
    }

    if (validatedData.featuredImageEn && !featuredImageEnIdToUse) {
      const mediaEn = await prisma.media.findFirst({
        where: { url: validatedData.featuredImageEn },
      });
      if (mediaEn) {
        featuredImageEnIdToUse = mediaEn.id;
      }
    }

    // Extract image URLs from content using server-side function
    const imageUrls = extractImagesFromContentServer(postData.content);

    // Create the post
    const post = await prisma.post.create({
      data: {
        ...postData,
        slug,
        ...(titleEn && { titleEn }),
        ...(contentEn && { contentEn }),
        ...(excerptEn && { excerptEn }),
        ...(featuredImageIdToUse && { featuredImageId: featuredImageIdToUse }),
        ...(featuredImageEnIdToUse && {
          featuredImageEnId: featuredImageEnIdToUse,
        }),
        author: {
          connect: { id: session.user.id },
        },
        ...(categories && categories.length > 0
          ? {
              categories: {
                create: categories.map((categoryId) => ({
                  category: {
                    connect: { id: categoryId },
                  },
                })),
              },
            }
          : {}),
      },
    });

    // Associate post with its images in the Media table
    if (imageUrls.length > 0) {
      try {
        // Log image URLs found in the content
        console.log(
          `Found ${imageUrls.length} images in post content:`,
          imageUrls
        );

        // Find all Media records with matching URLs
        const mediaRecords = await prisma.media.findMany({
          where: {
            url: {
              in: imageUrls,
            },
          },
        });

        console.log(
          `Found ${mediaRecords.length} matching media records in database`
        );

        // Connect each media record to the post
        for (const media of mediaRecords) {
          await prisma.$executeRaw`
            UPDATE "Media"
            SET "postId" = ${post.id}
            WHERE id = ${media.id}
          `;
        }
      } catch (mediaError) {
        console.error("Error associating media with post:", mediaError);
        // Continue execution even if media association fails
      }
    }

    // Create an entry in the log (if needed)
    try {
      console.log(`Created post "${post.title}" with ID: ${post.id}`);
    } catch (logError) {
      console.error("Error logging post creation:", logError);
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}
