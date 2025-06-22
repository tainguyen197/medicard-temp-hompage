import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { S3 } from "aws-sdk";
import { extname } from "path";

// Check if R2 environment variables are set
const isR2Available = !!(
  process.env.CF_R2_ACCOUNT_ID &&
  process.env.CF_R2_ACCESS_KEY_ID &&
  process.env.CF_R2_SECRET_ACCESS_KEY &&
  process.env.CF_R2_BUCKET
);

// Configure S3 client for Cloudflare R2 (only if environment variables are available)
const s3Client = isR2Available
  ? new S3({
      region: "auto",
      endpoint: `https://${process.env.CF_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CF_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY!,
      },
      s3ForcePathStyle: true, // Required for R2
    })
  : null;

const uploadFileToR2 = async (
  file: File,
  userId: string,
  prefix: string = "team"
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
        // Setting ACL for public access
        ACL: "public-read",
        // Adding Cache-Control to make browser cache the image
        CacheControl: "max-age=31536000",
      })
      .promise();
    publicUrl = `https://${process.env.CF_R2_PUBLIC_BUCKET}/${destination}`;
  } else {
    throw new Error("R2 configuration not available");
  }

  // Check if the user exists in the database before setting uploadedById
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  // Save media info to database
  const media = await prisma.media.create({
    data: {
      url: publicUrl,
      fileName: fileName,
      originalName: file.name,
      fileType: file.type,
      fileSize: file.size,
      // Only set uploadedById if the user exists in the database
      ...(userExists && { uploadedById: userId }),
    },
  });

  return { url: publicUrl, mediaId: media.id };
};

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const nameEn = (formData.get("nameEn") as string) || null;
    const title = formData.get("title") as string;
    const titleEn = (formData.get("titleEn") as string) || null;
    const description = formData.get("description") as string;
    const descriptionEn = (formData.get("descriptionEn") as string) || null;
    const order = parseInt(formData.get("order") as string) || 0;
    const status = formData.get("status") as string;

    // Validate required fields
    if (!name || !title || !description) {
      return NextResponse.json(
        { error: "Name, title, and description are required" },
        { status: 400 }
      );
    }

    // Validate status
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Handle file uploads for images
    const imageFile = formData.get("imageFile") as File | null;
    const imageEnFile = formData.get("imageEnFile") as File | null;

    let imageId: string | null = null;
    let imageEnId: string | null = null;

    // Upload Vietnamese image if provided
    if (imageFile && imageFile.size > 0) {
      try {
        const { mediaId } = await uploadFileToR2(
          imageFile,
          session.user.id,
          "team-vn"
        );
        imageId = mediaId;
      } catch (error) {
        console.error("Error uploading Vietnamese image:", error);
        return NextResponse.json(
          { error: "Failed to upload Vietnamese image" },
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
          "team-en"
        );
        imageEnId = mediaId;
      } catch (error) {
        console.error("Error uploading English image:", error);
        return NextResponse.json(
          { error: "Failed to upload English image" },
          { status: 500 }
        );
      }
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        nameEn,
        title,
        titleEn,
        description,
        descriptionEn,
        order,
        status,
        ...(imageId && { imageId }),
        ...(imageEnId && { imageEnId }),
      },
      include: {
        image: true,
        imageEn: true,
      },
    });

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      include: {
        image: true,
        imageEn: true,
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
