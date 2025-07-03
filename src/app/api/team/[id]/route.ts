import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { extname } from "path";
import { S3 } from "aws-sdk";
import { Logger } from "../../../../lib/utils";

// Check if R2 environment variables are set
const isR2Available = !!(
  process.env.CF_R2_ACCOUNT_ID &&
  process.env.CF_R2_ACCESS_KEY_ID &&
  process.env.CF_R2_SECRET_ACCESS_KEY &&
  process.env.CF_R2_BUCKET
);

// Configure S3 client for Cloudflare R2 (only if environment variables are available)
const s3 = isR2Available
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

  if (isR2Available && s3) {
    const bucketName = process.env.CF_R2_BUCKET!;
    const destination = `images/htcwellness/${userId}/${prefix}/${fileName}`;

    // Upload to Cloudflare R2
    const uploadResult = await s3
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
    console.log("R2 Upload successful:", uploadResult);
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
      include: {
        image: true,
        imageEn: true,
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const nameEn = (formData.get("nameEn") as string) || null;
    const title = formData.get("title") as string;
    const titleEn = (formData.get("titleEn") as string) || null;
    const description = formData.get("description") as string;
    const descriptionEn = (formData.get("descriptionEn") as string) || null;
    const order = parseInt(formData.get("order") as string, 10) || 0;
    const status = formData.get("status") as string;

    // Get existing team member for comparison
    const existingTeamMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!existingTeamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Handle file uploads for images
    const imageFile = formData.get("imageFile") as File | null;
    const imageEnFile = formData.get("imageEnFile") as File | null;

    let imageId: string | null = existingTeamMember.imageId;
    let imageEnId: string | null = existingTeamMember.imageEnId;

    // Upload Vietnamese image if provided
    if (imageFile && imageFile.size > 0) {
      try {
        const { mediaId } = await uploadFileToR2(
          imageFile,
          session.user.id,
          "team-vn"
        );
        imageId = mediaId;

        // If there was an old image, we could optionally delete it from R2 and database
        // For now, we'll keep the old images for safety
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

        // If there was an old image, we could optionally delete it from R2 and database
        // For now, we'll keep the old images for safety
      } catch (error) {
        console.error("Error uploading English image:", error);
        return NextResponse.json(
          { error: "Failed to upload English image" },
          { status: 500 }
        );
      }
    }

    const teamMember = await prisma.teamMember.update({
      where: { id },
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

    // Log the update with changes
    const changes: Record<string, any> = {};

    if (name !== existingTeamMember.name) {
      changes.name = { from: existingTeamMember.name, to: name };
    }
    if (title !== existingTeamMember.title) {
      changes.title = { from: existingTeamMember.title, to: title };
    }
    if (status !== existingTeamMember.status) {
      changes.status = { from: existingTeamMember.status, to: status };
    }
    if (order !== existingTeamMember.order) {
      changes.order = { from: existingTeamMember.order, to: order };
    }

    await Logger.logCRUD({
      operation: "UPDATE",
      entity: "TEAM_MEMBER",
      entityId: teamMember.id,
      userId: session.user.id,
      entityName: teamMember.name,
      changes: Object.keys(changes).length > 0 ? changes : undefined,
    });

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Get existing team member for logging
    const existingTeamMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!existingTeamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Delete the team member
    await prisma.teamMember.delete({
      where: { id },
    });

    // Log the deletion
    await Logger.logCRUD({
      operation: "DELETE",
      entity: "TEAM_MEMBER",
      entityId: id,
      userId: session.user.id,
      entityName: existingTeamMember.name,
    });

    return NextResponse.json(
      { message: "Team member deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Error deleting team member" },
      { status: 500 }
    );
  }
}
