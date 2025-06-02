import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// CORS headers
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-cache",
};

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.error("Authentication failed - no user session");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    // You need to implement token generation according to CKBox documentation
    // This is a placeholder - you'll need to get actual token from CKBox
    // See: https://ckeditor.com/docs/ckbox/latest/guides/authentication/token.html

    const token = {
      token: process.env.CKBOX_TOKEN || "your-ckbox-token",
      // Include additional user info if needed
      user: {
        id: session.user.id,
        name: session.user.name || "User",
      },
    };

    return NextResponse.json(token, { headers: corsHeaders });
  } catch (error) {
    console.error("Error generating CKBox token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500, headers: corsHeaders }
    );
  }
}
