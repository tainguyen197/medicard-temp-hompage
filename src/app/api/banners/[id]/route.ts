import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { S3 } from "aws-sdk";
import { extname } from "path";
import { Logger } from "../../../../lib/utils";

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

// GET /api/banners/[id] - Get a specific banner
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check authentication
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !["ADMIN", "EDITOR", "SUPER_ADMIN"].includes(session.user.role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const banner = await prisma.banner.findUnique({
      where: { id },
      include: {
        image: true,
      },
    });

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

// PUT /api/banners/[id] - Update a specific banner
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !["ADMIN", "EDITOR", "SUPER_ADMIN"].includes(session.user.role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle FormData instead of JSON to match the frontend
    const formData = await request.formData();
    const type = formData.get("type") as string;
    const link = (formData.get("link") as string) || null;
    const status = (formData.get("status") as string) || "ACTIVE";
    const imageFile = formData.get("imageFile") as File | null;

    // Get existing banner for comparison
    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    // Handle image upload if a new image is provided
    let imageId: string | null = existingBanner.imageId;

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

    // Validate type if provided
    if (type && !["HOMEPAGE", "SERVICE", "NEWS", "ABOUT"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be HOMEPAGE, SERVICE, NEWS, or ABOUT" },
        { status: 400 }
      );
    }

    // If type is being changed, check if another banner with that type exists
    if (type && type !== existingBanner.type) {
      const conflictingBanner = await prisma.banner.findUnique({
        where: { type },
      });

      if (conflictingBanner) {
        return NextResponse.json(
          { error: `A banner with type ${type} already exists` },
          { status: 400 }
        );
      }
    }

    // Update banner
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...(type && { type }),
        link: link !== undefined ? link : undefined,
        imageId: imageId !== undefined ? imageId : undefined,
        status: status || undefined,
      },
      include: {
        image: true,
      },
    });

    // Log the update with changes
    const changes: Record<string, any> = {};

    if (type && type !== existingBanner.type) {
      changes.type = { from: existingBanner.type, to: type };
    }
    if (link !== existingBanner.link) {
      changes.link = { from: existingBanner.link, to: link };
    }
    if (status && status !== existingBanner.status) {
      changes.status = { from: existingBanner.status, to: status };
    }
    if (imageId !== existingBanner.imageId) {
      changes.imageId = { from: existingBanner.imageId, to: imageId };
    }

    await Logger.logCRUD({
      operation: "UPDATE",
      entity: "BANNER",
      entityId: banner.id,
      userId: session.user.id,
      entityName: `${banner.type} Banner`,
      changes: Object.keys(changes).length > 0 ? changes : undefined,
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

// DELETE /api/banners/[id] - Delete a specific banner
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !["ADMIN", "EDITOR", "SUPER_ADMIN"].includes(session.user.role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get existing banner for logging
    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    // Delete the banner
    await prisma.banner.delete({
      where: { id },
    });

    // Log the deletion
    await Logger.logCRUD({
      operation: "DELETE",
      entity: "BANNER",
      entityId: id,
      userId: session.user.id,
      entityName: `${existingBanner.type} Banner`,
    });

    return NextResponse.json(
      { message: "Banner deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
