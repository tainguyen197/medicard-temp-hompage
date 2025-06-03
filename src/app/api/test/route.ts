import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    // Try to access different models
    const models = {
      hasUser: !!prisma.user,
      hasPost: !!prisma.post,
      hasService: !!prisma.service,
      hasCategory: !!prisma.category,
      hasMedia: !!prisma.media,
      hasAuditLog: !!prisma.auditLog,
    };

    // Try to count services
    let serviceCount = null;
    try {
      serviceCount = await prisma.service.count();
    } catch (e) {
      console.error("Error counting services:", e);
    }

    return NextResponse.json({
      models,
      serviceCount,
      prismaModels: Object.keys(prisma),
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json({ error: "Test failed" }, { status: 500 });
  }
}
