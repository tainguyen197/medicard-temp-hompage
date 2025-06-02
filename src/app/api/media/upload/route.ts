import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import { join, extname } from "path";
import { authOptions } from "../../../../lib/auth";

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image extensions
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

export async function POST(request: Request) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 5MB limit" },
        { status: 400 }
      );
    }

    // Check file type
    const fileExt = extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Create a unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const fileName = `${timestamp}-${randomStr}${fileExt}`;

    // Create the directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Save the file
    const filePath = join(uploadDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Return the URL of the uploaded file
    const fileUrl = `/uploads/${fileName}`;

    // Save file reference to database if needed
    // await prisma.media.create({
    //   data: {
    //     fileName,
    //     originalName: file.name,
    //     fileSize: file.size,
    //     fileType: file.type,
    //     url: fileUrl,
    //     uploadedBy: { connect: { id: session.user.id } },
    //   },
    // });

    return NextResponse.json({ url: fileUrl }, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
