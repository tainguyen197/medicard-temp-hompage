import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const password = await hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@medicare.com" },
    update: {},
    create: {
      email: "admin@medicare.com",
      name: "Admin User",
      password,
      role: "ADMIN",
    },
  });

  const superAdmin = await prisma.user.upsert({
    where: { email: "ç" },
    update: {},
    create: {
      email: "superadmin@medicare.com",
      name: "Super Admin",
      password,
      role: "SUPER_ADMIN",
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: "editor@medicare.com" },
    update: {},
    create: {
      email: "editor@medicare.com",
      name: "Editor User",
      password,
      role: "EDITOR",
    },
  });

  console.log("Admin user created:", admin.email);
  console.log("Super admin user created:", superAdmin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
