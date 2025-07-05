import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedContact() {
  try {
    // Check if contact information already exists
    const existingContact = await prisma.contact.findFirst();

    if (existingContact) {
      console.log("Contact information already exists. Updating...");
      
      // Update existing contact with appointment link
      await prisma.contact.update({
        where: { id: existingContact.id },
        data: {
          appointmentLink: "https://forms.gle/GJETkvXcnZ7hZwBr8",
        } as any,
      });
      
      console.log("Contact information updated successfully.");
    } else {
      console.log("Creating new contact information...");
      
      // Create new contact information
      await prisma.contact.create({
        data: {
          phone: "0901 430 077",
          address: "327 đường Nguyễn Trọng Tuyển, Phường 10, Quận Phú Nhuận, TP.HCM",
          addressEn: "327 Nguyen Trong Tuyen Street, Ward 10, Phu Nhuan District, Ho Chi Minh City",
          businessHours: "Thứ 2 - Thứ 7: 8h00 - 19h00<br/>Chủ nhật: 8h00 - 18h00",
          businessHoursEn: "Monday - Saturday: 8:00 AM - 7:00 PM<br/>Sunday: 8:00 AM - 6:00 PM",
          facebookUrl: "https://www.facebook.com/htcwellness/",
          zaloUrl: "https://zalo.me/0901430077",
          instagramUrl: "https://www.instagram.com/healthcaretherapycenter/",
          appointmentLink: "https://forms.gle/GJETkvXcnZ7hZwBr8",
          status: "ACTIVE",
        } as any,
      });
      
      console.log("Contact information created successfully.");
    }
  } catch (error) {
    console.error("Error seeding contact information:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedContact()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 