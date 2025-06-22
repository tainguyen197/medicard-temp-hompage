import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { S3 } from "aws-sdk";
import { extname } from "path";

// Add the same R2 configuration as TeamMember API
const isR2Available = !!(
  process.env.CF_R2_ACCOUNT_ID &&
  process.env.CF_R2_ACCESS_KEY_ID &&
  process.env.CF_R2_SECRET_ACCESS_KEY &&
  process.env.CF_R2_BUCKET
);

const s3Client = isR2Available
  ? new S3({
      region: "auto",
      endpoint: `https://${process.env.CF_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CF_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY!,
      },
      s3ForcePathStyle: true,
    })
  : null;

const uploadFileToR2 = async (
  file: File,
  userId: string,
  prefix: string = "banner"
): Promise<{ url: string; mediaId: string }> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 10);
  const fileExt = extname(file.name);
  const fileName = `${timestamp}-${randomId}${fileExt}`;

  let publicUrl: string;

  if (isR2Available && s3Client) {
    const bucketName = process.env.CF_R2_BUCKET!;
    const destination = `images/htcwellness/${userId}/${prefix}/${fileName}`;

    await s3Client
      .putObject({
        Bucket: bucketName,
        Key: destination,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
        CacheControl: "max-age=31536000",
      })
      .promise();
    publicUrl = `https://${process.env.CF_R2_PUBLIC_BUCKET}/${destination}`;
  } else {
    throw new Error("R2 configuration not available");
  }

  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  const media = await prisma.media.create({
    data: {
      url: publicUrl,
      fileName: fileName,
      originalName: file.name,
      fileType: file.type,
      fileSize: file.size,
      ...(userExists && { uploadedById: userId }),
    },
  });

  return { url: publicUrl, mediaId: media.id };
};

// GET /api/banners - List all banners (should only be 3 max: homepage, service, news)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";

    // Build where clause
    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    // Get banners with media relations
    const banners = await prisma.banner.findMany({
      where,
      include: {
        image: true,
      },
      orderBy: { type: "asc" }, // Homepage, News, Service alphabetical order
    });

    return NextResponse.json({
      banners,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: banners.length,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

// POST /api/banners - Create or update banner (upsert by type)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle FormData instead of JSON
    const formData = await request.formData();

    const type = formData.get("type") as string;
    const link = (formData.get("link") as string) || null;
    const status = (formData.get("status") as string) || "ACTIVE";
    const imageFile = formData.get("imageFile") as File | null;

    // Validate required fields
    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    if (!["HOMEPAGE", "SERVICE", "NEWS"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be HOMEPAGE, SERVICE, or NEWS" },
        { status: 400 }
      );
    }

    let imageId: string | null = null;

    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
      try {
        const { mediaId } = await uploadFileToR2(
          imageFile,
          session.user.id,
          "banner"
        );
        imageId = mediaId;
      } catch (error) {
        console.error("Error uploading banner image:", error);
        return NextResponse.json(
          { error: "Failed to upload banner image" },
          { status: 500 }
        );
      }
    }

    const banner = await prisma.banner.upsert({
      where: { type },
      update: {
        link,
        imageId,
        status,
      },
      create: {
        type,
        link,
        imageId,
        status,
      },
      include: {
        image: true,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Error creating/updating banner:", error);
    return NextResponse.json(
      { error: "Failed to save banner" },
      { status: 500 }
    );
  }
}
