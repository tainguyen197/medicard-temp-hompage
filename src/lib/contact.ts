import { prisma } from "@/lib/prisma";

export interface ContactData {
  id: string;
  phone: string | null;
  address: string | null;
  addressEn: string | null;
  businessHours: string | null;
  businessHoursEn: string | null;
  facebookUrl: string | null;
  zaloUrl: string | null;
  instagramUrl: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getContactData(): Promise<ContactData | null> {
  try {
    const contact = await prisma.contact.findFirst({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });
    return contact;
  } catch (error) {
    console.error("Error fetching contact data:", error);
    return null;
  }
}

// Fallback contact data (current hardcoded values)
export const fallbackContactData: Partial<ContactData> = {
  phone: "0901 430 077",
  address: "327 đường Nguyễn Trọng Tuyển, Phường 10, Quận Phú Nhuận, TP.HCM",
  businessHours: "Thứ 2 - Thứ 7: 8h00 - 19h00\nChủ nhật: 8h00 - 18h00",
  facebookUrl: "https://www.facebook.com/htcwellness/",
  zaloUrl: "https://zalo.me/0901430077",
  instagramUrl: "https://www.instagram.com/healthcaretherapycenter/",
};
