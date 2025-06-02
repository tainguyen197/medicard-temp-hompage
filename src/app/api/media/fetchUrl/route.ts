import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { success: 0, message: "URL is required" },
        { status: 400 }
      );
    }

    // For link tool
    if (body.url) {
      // You could fetch metadata about the URL here
      // For now, just return the URL
      return NextResponse.json({
        success: 1,
        link: url,
        meta: {
          title: "External link",
          description: "Visit the external link",
        },
      });
    }

    // For image tool - fetch by URL
    return NextResponse.json({
      success: 1,
      file: {
        url,
      },
    });
  } catch (error) {
    console.error("Error processing URL:", error);
    return NextResponse.json(
      { success: 0, message: "Failed to process URL" },
      { status: 500 }
    );
  }
}
