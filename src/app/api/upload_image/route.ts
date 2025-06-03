import { NextResponse } from "next/server";
import { extname, join } from "path";
import { writeFile, mkdir } from "fs/promises";
import prisma from "@/lib/prisma"; // Using @ alias based on tsconfig
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Using @ alias based on tsconfig
import { S3 } from "aws-sdk"; // For Cloudflare R2

/**
 * Image Upload API
 *
 * This API handles image uploads for the application.
 * - Supports both local storage and Cloudflare R2 storage
 * - Authentication required
 * - Stores file metadata in the database
 * - Image cropping is handled client-side in the ImageUpload component
 *   before the file is sent to this endpoint
 */

// CORS headers for both POST and OPTIONS responses
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-CSRF-TOKEN, Accept",
  "Cache-Control": "no-cache",
};

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

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

export async function POST(request: Request) {
  console.log("Image upload request received");

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.error("Authentication failed - no user session");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    console.log("User authenticated:", session.user.id);

    const formData = await request.formData();
    console.log("FormData keys:", Array.from(formData.keys()));

    const file = formData.get("upload") as File; // CKEditor's default field name is 'upload'

    if (!file) {
      console.error("No file provided in request");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log("File received:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Basic validation
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      console.error(`Invalid file type: ${file.type}`);
      return NextResponse.json(
        { error: "Invalid file type." },
        { status: 400, headers: corsHeaders }
      );
    }
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      console.error(`File too large: ${file.size} bytes`);
      return NextResponse.json(
        { error: "File size exceeds 5MB limit." },
        { status: 400, headers: corsHeaders }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 10);
    const fileExt = extname(file.name);
    // User-specific folder using the session.user.id
    const fileName = `${timestamp}-${randomId}${fileExt}`;

    let publicUrl: string;

    // Use Cloudflare R2 if available, otherwise fall back to local file storage
    if (isR2Available && s3) {
      // Extract just the bucket name from the environment variable
      const bucketName = process.env.CF_R2_BUCKET!;
      const destination = `images/htcwellness/${session.user.id}/${fileName}`;

      console.log(`Using R2 bucket: ${bucketName}`);
      console.log(`Destination key: ${destination}`);

      // Upload to Cloudflare R2
      try {
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

        // Construct the public URL for R2
        publicUrl = `https://${process.env.CF_R2_PUBLIC_BUCKET}/${destination}`;
      } catch (uploadError) {
        console.error("S3 upload error:", uploadError);
        return NextResponse.json(
          { error: `R2 Upload failed: ${(uploadError as Error).message}` },
          { status: 500, headers: corsHeaders }
        );
      }
    } else {
      // FALLBACK: Local file storage
      console.log("Using local file storage (R2 not configured)");

      // Create uploads directory if it doesn't exist
      const uploadDir = join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });

      const filePath = join(uploadDir, fileName);
      const destination = `uploads/${fileName}`;

      try {
        // Write the file
        await writeFile(filePath, buffer);
        console.log(`File saved to ${filePath}`);

        // Set the public URL
        publicUrl = `/${destination}`;
      } catch (fileError) {
        console.error("File system error:", fileError);
        return NextResponse.json(
          { error: `File save failed: ${(fileError as Error).message}` },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    console.log(`Generated public URL: ${publicUrl}`);

    // Save media info to database
    try {
      const media = await prisma.media.create({
        data: {
          url: publicUrl,
          fileName: fileName,
          originalName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadedById: session.user.id,
        },
      });

      console.log(`Image uploaded successfully: ${media.id}`);

      // CKEditor SimpleUploadAdapter expects a JSON response with a "url" property
      const response = {
        url: publicUrl,
        mediaId: media.id,
      };

      console.log("Sending response:", response);

      return NextResponse.json(response, {
        status: 201,
        headers: corsHeaders,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      // If DB fails but upload succeeded, still return the URL
      return NextResponse.json(
        {
          url: publicUrl,
          warning: "Image uploaded but metadata not saved",
        },
        {
          status: 201,
          headers: corsHeaders,
        }
      );
    }
  } catch (error) {
    console.error("Error in upload handler:", error);
    return NextResponse.json(
      { error: `Error uploading image: ${(error as Error).message}` },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
