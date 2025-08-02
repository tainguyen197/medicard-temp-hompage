import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { extname } from "path";
import { Logger } from "@/lib/utils";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Check if R2 environment variables are set
const isR2Available = !!(
  process.env.CF_R2_ACCOUNT_ID &&
  process.env.CF_R2_ACCESS_KEY_ID &&
  process.env.CF_R2_SECRET_ACCESS_KEY &&
  process.env.CF_R2_BUCKET
);

// Fix the S3 client initialization to use the correct environment variables:
const s3Client = isR2Available ? new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY!,
  },
}) : null;

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

    // Use AWS SDK v3 syntax
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: destination,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read",
      CacheControl: "max-age=31536000",
    });

    await s3Client.send(command);
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
    if (!session?.user || !["ADMIN", "EDITOR", "SUPER_ADMIN"].includes(session.user.role)) {
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
        imageEn: true,
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
  console.log('=== BANNER API CALLED ===');
  console.log('Content-Type:', request.headers.get('content-type'));
  console.log('Content-Length:', request.headers.get('content-length'));
  
  try {
    const formData = await request.formData();
    console.log('FormData received successfully');
    console.log('FormData entries:', Array.from(formData.entries()).map(([key, value]) => 
      `${key}: ${value instanceof File ? `File(${value.size} bytes)` : value}`
    ));
    
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "EDITOR", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle FormData instead of JSON
    const type = formData.get("type") as string;
    const link = (formData.get("link") as string) || null;
    const status = (formData.get("status") as string) || "ACTIVE";
    const imageFile = formData.get("imageFile") as File | null;
    const imageEnFile = formData.get("imageEnFile") as File | null;

    // Validate required fields
    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    if (!["HOMEPAGE", "SERVICE", "NEWS", "ABOUT", "CONTACT"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be HOMEPAGE, SERVICE, NEWS, ABOUT, or CONTACT" },
        { status: 400 }
      );
    }

    let imageId: string | null = null;
    let imageEnId: string | null = null;

    // Upload Vietnamese image if provided
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

    // Upload English image if provided
    if (imageEnFile && imageEnFile.size > 0) {
      try {
        const { mediaId } = await uploadFileToR2(
          imageEnFile,
          session.user.id,
          "banner"
        );
        imageEnId = mediaId;
      } catch (error) {
        console.error("Error uploading banner English image:", error);
        return NextResponse.json(
          { error: "Failed to upload banner English image" },
          { status: 500 }
        );
      }
    }

    const banner = await prisma.banner.upsert({
      where: { type },
      update: {
        link,
        imageId,
        imageEnId,
        status,
      },
      create: {
        type,
        link,
        imageId,
        imageEnId,
        status,
      },
      include: {
        image: true,
        imageEn: true,
      },
    });

    // Log the creation/update
    const operation = banner.createdAt === banner.updatedAt ? 'CREATE' : 'UPDATE';
    await Logger.logCRUD({
      operation,
      entity: 'BANNER',
      entityId: banner.id,
      userId: session.user.id,
      entityName: `${type} Banner`,
      changes: {
        type: banner.type,
        status: banner.status,
        hasImage: !!banner.imageId,
        link: banner.link,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('Error parsing FormData:', error);
    return NextResponse.json(
      { error: "Failed to parse request data" },
      { status: 400 }
    );
  }
}
