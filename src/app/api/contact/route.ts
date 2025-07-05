import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Logger } from "../../../lib/utils";

// Validation schema for contact data
const contactSchema = z.object({
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Valid email is required").min(1, "Email is required"),
  address: z.string().min(1, "Address is required"),
  addressEn: z.string().optional(),
  businessHours: z.string().min(1, "Business hours are required"),
  businessHoursEn: z.string().optional(),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  zaloUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  appointmentLink: z.string().url().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

// GET /api/contact - Get contact information
export async function GET() {
  try {
    // Get the first (and should be only) contact record
    const contact = await prisma.contact.findFirst({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ contact });
  } catch (error) {
    console.error("Error fetching contact:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact information" },
      { status: 500 }
    );
  }
}

// POST /api/contact - Create or update contact information
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission (ADMIN or EDITOR)
    if (!["ADMIN", "EDITOR", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Clean up empty URLs
    const cleanData = {
      ...validatedData,
      facebookUrl: validatedData.facebookUrl || null,
      zaloUrl: validatedData.zaloUrl || null,
      instagramUrl: validatedData.instagramUrl || null,
      appointmentLink: validatedData.appointmentLink || null,
      addressEn: validatedData.addressEn || null,
      businessHoursEn: validatedData.businessHoursEn || null,
    };

    // Since we only want one contact record, check if one exists first
    const existingContact = await prisma.contact.findFirst();

    let contact;
    if (existingContact) {
      // Update existing contact
      contact = await prisma.contact.update({
        where: { id: existingContact.id },
        data: cleanData,
      });
    } else {
      // Create new contact
      contact = await prisma.contact.create({
        data: cleanData,
      });
    }

    // Log the creation/update
    const operation = existingContact ? "UPDATE" : "CREATE";
    const changes: Record<string, any> = {};

    if (existingContact) {
      if (cleanData.phone !== existingContact.phone) {
        changes.phone = { from: existingContact.phone, to: cleanData.phone };
      }
      if (cleanData.email !== (existingContact as any).email) {
        changes.email = { from: (existingContact as any).email, to: cleanData.email };
      }
      if (cleanData.address !== existingContact.address) {
        changes.address = {
          from: existingContact.address,
          to: cleanData.address,
        };
      }
      if (cleanData.facebookUrl !== existingContact.facebookUrl) {
        changes.facebookUrl = {
          from: existingContact.facebookUrl,
          to: cleanData.facebookUrl,
        };
      }
      if (cleanData.appointmentLink !== (existingContact as any).appointmentLink) {
        changes.appointmentLink = {
          from: (existingContact as any).appointmentLink,
          to: cleanData.appointmentLink,
        };
      }
      // Add other field comparisons as needed
    }

    await Logger.logCRUD({
      operation,
      entity: "CONTACT",
      entityId: contact.id,
      userId: session.user.id,
      entityName: "Contact Information",
      changes: Object.keys(changes).length > 0 ? changes : undefined,
    });

    return NextResponse.json({ contact });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating/updating contact:", error);
    return NextResponse.json(
      { error: "Failed to save contact information" },
      { status: 500 }
    );
  }
}

// PUT /api/contact - Update contact information
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Get existing contact info for comparison
    const existingContact = await prisma.contact.findFirst();

    // Update or create contact information
    const contact = await prisma.contact.upsert({
      where: { id: existingContact?.id || "default" },
      update: {
        phone: validatedData.phone,
        email: validatedData.email,
        address: validatedData.address,
        addressEn: validatedData.addressEn,
        businessHours: validatedData.businessHours,
        businessHoursEn: validatedData.businessHoursEn,
        facebookUrl: validatedData.facebookUrl,
        zaloUrl: validatedData.zaloUrl,
        instagramUrl: validatedData.instagramUrl,
        appointmentLink: validatedData.appointmentLink,
        status: validatedData.status,
      } as any,
      create: {
        phone: validatedData.phone,
        email: validatedData.email,
        address: validatedData.address,
        addressEn: validatedData.addressEn,
        businessHours: validatedData.businessHours,
        businessHoursEn: validatedData.businessHoursEn,
        facebookUrl: validatedData.facebookUrl,
        zaloUrl: validatedData.zaloUrl,
        instagramUrl: validatedData.instagramUrl,
        appointmentLink: validatedData.appointmentLink,
        status: validatedData.status,
      } as any,
    });

    // Log the update
    const operation = existingContact ? "UPDATE" : "CREATE";
    const changes: Record<string, any> = {};

    if (existingContact) {
      if (validatedData.phone !== existingContact.phone) {
        changes.phone = {
          from: existingContact.phone,
          to: validatedData.phone,
        };
      }
      if (validatedData.address !== existingContact.address) {
        changes.address = {
          from: existingContact.address,
          to: validatedData.address,
        };
      }
      if (validatedData.facebookUrl !== existingContact.facebookUrl) {
        changes.facebookUrl = {
          from: existingContact.facebookUrl,
          to: validatedData.facebookUrl,
        };
      }
      // Add other field comparisons as needed
    }

    await Logger.logCRUD({
      operation,
      entity: "CONTACT",
      entityId: contact.id,
      userId: session.user.id,
      entityName: "Contact Information",
      changes: Object.keys(changes).length > 0 ? changes : undefined,
    });

    return NextResponse.json(contact);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating contact information:", error);
    return NextResponse.json(
      { error: "Error updating contact information" },
      { status: 500 }
    );
  }
}
