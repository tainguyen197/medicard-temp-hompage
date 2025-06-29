import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding team members...");

  // Create team members data based on the provided team information
  const teamMembersData = [
    {
      name: "NGUYỄN THỊ HỒNG HẠNH",
      nameEn: "NGUYEN THI HONG HANH",
      title: "BS. CKI",
      titleEn: "Specialist Doctor Level I",
      description: "Nhiều năm kinh nghiệm trong lĩnh vực Vật Lý Trị Liệu - Phục Hồi Chức Năng",
      descriptionEn: "Many years of experience in the field of Physical Therapy - Functional Rehabilitation",
      order: 1,
      status: "ACTIVE",
    },
    {
      name: "NGUYỄN VĂN THỊNH", 
      nameEn: "NGUYEN VAN THINH",
      title: "BS. CK",
      titleEn: "Specialist Doctor",
      description: "Hơn 15 năm trong lĩnh vực Phục Hồi Chức Năng và Nội Cơ Xương Khớp, Y Học Cổ Truyền, có kinh nghiệm điều trị những trường hợp khó và phức tạp",
      descriptionEn: "Over 15 years in the field of Functional Rehabilitation and Internal Musculoskeletal Medicine, Traditional Medicine, with experience in treating difficult and complex cases",
      order: 2,
      status: "ACTIVE",
    },
    {
      name: "NGUYỄN THỊ MAI LINH",
      nameEn: "NGUYEN THI MAI LINH", 
      title: "THS. BS",
      titleEn: "Master's Doctor",
      description: "Thành viên chính thức của hiệp hội Trị liệu Cột sống Thần Kinh Chiropractic tại Úc. Thạc sĩ - Bác sĩ Mai Linh đảm nhiệm vai trò Bác sĩ làm sáng tại nhiều quốc gia tiên tiến trên thế giới như: Úc, Singapore, Việt Nam.",
      descriptionEn: "Official member of the Chiropractic Spinal Nerve Therapy Association in Australia. Master's Doctor Mai Linh has served as a leading doctor in many advanced countries around the world such as: Australia, Singapore, Vietnam.",
      order: 3,
      status: "ACTIVE",
    },
    {
      name: "ĐOÀN HẢI YẾN",
      nameEn: "DOAN HAI YEN",
      title: "BS. CK", 
      titleEn: "Specialist Doctor",
      description: "Bác sĩ Đoàn Hải Yến có kinh nghiệm chuyên sâu trong lĩnh vực Cơ Xương Khớp - Phục hồi cơ thể.",
      descriptionEn: "Dr. Doan Hai Yen has deep experience in the field of Musculoskeletal - Body rehabilitation.",
      order: 4,
      status: "ACTIVE",
    },
  ];

  // Use upsert to avoid duplicates and allow re-running the seed
  for (const teamMemberData of teamMembersData) {
    const teamMember = await prisma.teamMember.upsert({
      where: { id: teamMemberData.name, },
      update: teamMemberData,
      create: teamMemberData,
    });
    console.log(`Created/Updated team member: ${teamMember.name} (${teamMember.title})`);
  }

  console.log("Team members seeding completed.");
}

main()
  .catch((e) => {
    console.error("Error seeding team members:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 