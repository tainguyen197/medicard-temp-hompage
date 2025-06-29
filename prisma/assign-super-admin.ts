import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function assignSuperAdmin() {
  try {
    // Update existing admin user to SUPER_ADMIN
    const superAdmin = await prisma.user.update({
      where: { email: "admin@medicare.com" },
      data: { role: "SUPER_ADMIN" },
    });

    console.log("✅ Super Admin assigned to:", superAdmin.email);

    // Optionally create a new SUPER_ADMIN user
    // Uncomment the following code if you want to create a new user
    
    /*
    const { hash } = await import("bcrypt");
    const password = await hash("superadmin123", 10);
    
    const newSuperAdmin = await prisma.user.create({
      data: {
        email: "superadmin@medicare.com",
        name: "Super Administrator",
        password,
        role: "SUPER_ADMIN",
      },
    });
    
    console.log("✅ New Super Admin created:", newSuperAdmin.email);
    */

  } catch (error) {
    console.error("❌ Error assigning Super Admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

assignSuperAdmin();