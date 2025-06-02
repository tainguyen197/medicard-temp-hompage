import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { createSlug, extractImagesFromContentServer } from "../../../lib/utils";

// Schema for post creation/update
const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED", "SCHEDULED"]),
  publishedAt: z.string().optional(),
  categories: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  slug: z.string().optional(),
});

// GET /api/posts - Get all posts with pagination, filtering, etc.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status");
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");

  // Build filter object
  const where: any = {};

  if (status) {
    where.status = status;
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

  try {
    // Get total count for pagination
    const total = await prisma.post.count({ where });

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

    // Extract categories
    const { categories, ...postData } = validatedData;

    // Extract image URLs from content using server-side function
    const imageUrls = extractImagesFromContentServer(postData.content);

    // Create the post
    const post = await prisma.post.create({
      data: {
        ...postData,
        slug,
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
          // Using raw query or direct prisma method based on your schema
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
