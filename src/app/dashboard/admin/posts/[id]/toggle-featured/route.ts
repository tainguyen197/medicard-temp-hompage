import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Protect route
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const { id } = params;

  try {
    // Get current post
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        featured: true,
      },
    });

    if (!post) {
      return NextResponse.redirect(
        new URL(`/dashboard/admin/posts?error=Post not found`, request.url)
      );
    }

    // If we're trying to feature a post, check if we've reached the limit
    if (!post.featured) {
      const featuredCount = await prisma.post.count({
        where: { featured: true },
      });

      if (featuredCount >= 5) {
        return NextResponse.redirect(
          new URL(
            `/dashboard/admin/posts?error=Maximum of 5 featured posts allowed. Please unfeature a post first.`,
            request.url
          )
        );
      }
    }

    // Toggle featured status
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        featured: !post.featured,
      },
    });

    // Redirect back to posts page with success message
    const successMessage = updatedPost.featured
      ? `"${post.title}" is now featured`
      : `"${post.title}" is no longer featured`;

    return NextResponse.redirect(
      new URL(`/dashboard/admin/posts?success=${successMessage}`, request.url)
    );
  } catch (error) {
    console.error("Error toggling featured status:", error);
    return NextResponse.redirect(
      new URL(
        `/dashboard/admin/posts?error=Failed to update post`,
        request.url
      )
    );
  }
} 