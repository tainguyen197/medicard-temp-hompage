import { prisma } from "@/lib/prisma";
import { ContactData } from "@/types/contact";

export async function getContactData(): Promise<ContactData | null> {
  try {
    const contact = await prisma.contact.findFirst({
      orderBy: { createdAt: "desc" },
    });
    return contact;
  } catch (error) {
    console.error("Error fetching contact data:", error);
    return null;
  }
}

/**
 * Get the appointment link from the database
 * Returns default link if no appointment link is configured
 */
export async function getAppointmentLink(): Promise<string> {
  try {
    const contact = await prisma.contact.findFirst();
    
    return (contact as any)?.appointmentLink || "";
  } catch (error) {
    console.error("Error fetching appointment link:", error);
    return "";
  }
}

/**
 * Get the email from the database
 * Returns default email if no email is configured
 */
export async function getContactEmail(): Promise<string> {
  try {
    const contact = await prisma.contact.findFirst({
    });
    
    return (contact as any)?.email || "";
  } catch (error) {
    console.error("Error fetching contact email:", error);
    return "";
  }
}

/**
 * Get complete contact information
 */
export async function getContactInfo() {
  try {
    const contact = await prisma.contact.findFirst({
      orderBy: { createdAt: "desc" },
    });
    
    return contact;
  } catch (error) {
    console.error("Error fetching contact information:", error);
    return null;
  }
}
