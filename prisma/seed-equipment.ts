import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding Equipment ...`);

  // Equipment data (bilingual, from translation files)
  const equipmentData = [
    {
      name: "SHOCKWAVE THERAPY",
      nameEn: "SHOCKWAVE THERAPY",
      description:
        "Sử dụng sóng xung kích tạo áp lực cơ học và sức căng lên mô tổn thương, làm tăng tính thấm của màng tế bào, giúp tăng tuần hoàn tại chỗ và chuyển hóa tại phần mô được điều trị.",
      descriptionEn:
        "Uses shock waves to create mechanical pressure and tension on damaged tissue, increasing cell membrane permeability, helping to increase local circulation and metabolism in the treated tissue area.",
      order: 1,
      status: "ACTIVE",
      showOnHomepage: true,
    },
    {
      name: "Laser công suất cao thông minh",
      nameEn: "LASER THERAPY",
      description:
        "Dùng tia Laser tần số cao đi vào mô cơ, mô xương giúp giảm đau, tăng tốc chuyển hóa, giúp phục hồi tế bào nhanh hơn từ đó nâng cao khả năng điều trị và làm lành lại vết thương.",
      descriptionEn:
        "Uses a single wavelength of light, concentrated into a narrow beam, creating a high-energy area. When this beam of light is projected onto the treatment area, it will create a biological effect that stimulates the treatment and regeneration process of the tissue.",
      order: 2,
      status: "ACTIVE",
      showOnHomepage: true,
    },
    {
      name: "Winback Tecar Therapy",
      nameEn: "RF - RADIO FREQUENCY",
      description:
        "Sử dụng các dòng điện đặc trị tác động lên vùng cơ bị tắt nghẽn. Từ đó kích thích thần kinh cơ, chống teo cơ, kháng viêm, giảm đau.",
      descriptionEn:
        "A non-invasive treatment method, using radiofrequency waves to pass through the skin, acting on the tissue layers below, generating heat to help reduce pain, reduce inflammation, increase circulation and promote tissue regeneration.",
      order: 3,
      status: "ACTIVE",
      showOnHomepage: true,
    },
    {
      name: "Điện xung kết hợp siêu âm",
      nameEn: null,
      description:
        "Sử dụng sóng siêu âm tác động đến mô cơ giúp giảm sưng nề mô mềm, giảm đau, giảm co cứng, tăng cường tuần hoàn máu, làm đẩy nhanh quá trình làm lành và hồi phục chức năng.",
      descriptionEn: null,
      order: 4,
      status: "ACTIVE",
      showOnHomepage: true,
    },
  ];

  for (const equipment of equipmentData) {
    const created = await prisma.equipment.upsert({
      where: { name: equipment.name },
      update: equipment,
      create: equipment,
    });
    console.log(`Created/updated equipment: ${created.name} (id: ${created.id})`);
  }

  console.log(`Equipment seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 