import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import { canPublishContent } from "../../../../../lib/utils";

// Schema for status update
const statusUpdateSchema = z.object({
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]),
});

// PATCH /api/news/[id]/status - Update news status
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

    // Try to use the news model directly
    try {
      // Check if news exists
      const existingNews = await prisma.news.findUnique({
        where: { id },
      });

      if (!existingNews) {
        return NextResponse.json(
          { error: "News article not found" },
          { status: 404 }
        );
      }

      // Update the news status
      const updatedNews = await prisma.news.update({
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
          entity: "NEWS",
          entityId: id,
          userId: session.user.id,
          details: JSON.stringify({
            previousStatus: existingNews.status,
            newStatus: status,
          }),
        },
      });

      return NextResponse.json({
        message: "Status updated successfully",
        news: updatedNews,
      });
    } catch (prismaError) {
      console.error("Prisma error:", prismaError);

      // Fallback to raw SQL if Prisma model access fails
      try {
        // Check if news exists with raw query
        const news = await prisma.$queryRaw`
          SELECT * FROM News WHERE id = ${id}
        `;

        if (!news || (news as any[]).length === 0) {
          return NextResponse.json(
            { error: "News article not found" },
            { status: 404 }
          );
        }

        const existingNews = (news as any[])[0];

        // Update news with raw query
        await prisma.$executeRaw`
          UPDATE News 
          SET status = ${status}
          WHERE id = ${id}
        `;

        // Log the status change
        await prisma.auditLog.create({
          data: {
            action: "UPDATE_STATUS",
            entity: "NEWS",
            entityId: id,
            userId: session.user.id,
            details: JSON.stringify({
              previousStatus: existingNews.status,
              newStatus: status,
            }),
          },
        });

        return NextResponse.json({
          message: "Status updated successfully (raw SQL)",
          news: {
            id,
            title: existingNews.title,
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

    console.error("Error updating news status:", error);
    return NextResponse.json(
      { error: "Error updating news status" },
      { status: 500 }
    );
  }
}

// POST version for compatibility with NewsTable component
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(request, { params });
}
