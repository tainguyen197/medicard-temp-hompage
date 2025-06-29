import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Create a default user
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash("password123", saltRounds);
  const user = await prisma.user.upsert({
    where: { email: "editor@example.com" },
    update: {},
    create: {
      email: "editor@example.com",
      name: "Default Editor",
      password: passwordHash,
      role: "EDITOR",
    },
  });
  console.log(`Created user with id: ${user.id}`);

  // Create sample categories
  const mentalWellnessCategory = await prisma.category.upsert({
    where: { slug: "mental-wellness" },
    update: {},
    create: {
      name: "Mental Wellness",
      slug: "mental-wellness",
      description:
        "Articles and resources related to mental health and well-being.",
    },
  });
  console.log(`Created category with id: ${mentalWellnessCategory.id}`);

  const physicalRehabCategory = await prisma.category.upsert({
    where: { slug: "physical-rehabilitation" },
    update: {},
    create: {
      name: "Physical Rehabilitation",
      slug: "physical-rehabilitation",
      description: "Information on physical therapy and recovery processes.",
    },
  });
  console.log(`Created category with id: ${physicalRehabCategory.id}`);


  // Create sample services - Healthcare Therapy Center services based on https://htcwellness.com/services
  const servicesData = [
    {
      title: "Y HỌC CỔ TRUYỀN",
      titleEn: "Traditional Medicine",
      slug: "y-hoc-co-truyen",
      description:
        "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại cơ thể để phòng bệnh và trị bệnh một cách tự nhiên.",
      descriptionEn:
        "Preserving community health with the essence of the nation: Natural medicines flexibly adjusted for different cases, combined with other traditional medicine treatment methods such as acupuncture, massage, acupressure... with the main goal of focusing on adjusting and rebalancing the body to prevent and treat diseases naturally.",
      shortDescription:
        "Điều trị bằng thuốc thảo dược tự nhiên kết hợp châm cứu, xoa bóp, bấm huyệt.",
      shortDescriptionEn:
        "Treatment with natural herbal medicines combined with acupuncture, massage, and acupressure.",
      keywords:
        "y học cổ truyền, châm cứu, xoa bóp, bấm huyệt, thuốc thảo dược, điều trị tự nhiên",
      enKeywords:
        "traditional medicine, acupuncture, massage, acupressure, herbal medicine, natural treatment",
      status: "PUBLISHED",
    },
    {
      title: "ĐIỀU TRỊ VẬT LÝ TRỊ LIỆU CÔNG NGHỆ CAO",
      titleEn: "High-Tech Physical Therapy Treatment",
      slug: "dieu-tri-vat-ly-tri-lieu-cong-nghe-cao",
      description:
        "Healthcare Therapy Center áp dụng những công nghệ vật lý trị liệu tiên tiến, hiện đại nhằm tối đa hóa khả năng điều trị, phục hồi của khách hàng. Các công nghệ Laser công suất cao, Sóng cao tần Radio Frequency (RF), Sóng xung kích Shockwave được chứng minh qua nhiều nghiên cứu khoa học trên thế giới là hiệu quả trong việc giảm đau, tăng cường quá trình hồi phục và cải thiện chức năng vận động.",
      descriptionEn:
        "Healthcare Therapy Center applies advanced, modern physical therapy technologies to maximize customers' treatment and recovery capabilities. High-power Laser, Radio Frequency (RF), and Shockwave technologies have been proven through many scientific studies worldwide to be effective in pain relief, enhancing recovery processes, and improving motor function.",
      shortDescription:
        "Công nghệ Laser, RF, Shockwave hiện đại để điều trị và phục hồi tối ưu.",
      shortDescriptionEn:
        "Modern Laser, RF, Shockwave technologies for optimal treatment and recovery.",
      keywords:
        "vật lý trị liệu, laser công suất cao, radio frequency, shockwave, công nghệ cao",
      enKeywords:
        "physical therapy, high-power laser, radio frequency, shockwave, high technology",
      status: "PUBLISHED",
    },
    {
      title: "PHỤC HỒI CHỨC NĂNG CÔNG NGHỆ CAO",
      titleEn: "High-Tech Functional Rehabilitation",
      slug: "phuc-hoi-chuc-nang-cong-nghe-cao",
      description:
        "Điều trị các bệnh về cột sống như đau cổ-lưng, đau thần kinh tọa, thoát vị đĩa đệm...; Các bệnh lý về gân - khớp như: viêm chop xoay, đau khớp gối, khớp cổ tay, gai gót chân; hội chứng ống cổ tay, viêm gân duỗi ngón cái, tenis elbow…; Các tình trạng căng mỏi cơ cấp - mạn. Sử dụng những thiết bị và phương pháp phục hồi chức năng tiên tiến nhất để giúp bệnh nhân lấy lại khả năng vận động và cải thiện chất lượng cuộc sống.",
      descriptionEn:
        "Treatment of spinal diseases such as neck-back pain, sciatica, herniated disc...; Tendon-joint pathologies such as: rotator cuff inflammation, knee joint pain, wrist joint pain, heel spurs; carpal tunnel syndrome, thumb extensor tendinitis, tennis elbow...; Acute-chronic muscle tension conditions. Using the most advanced functional rehabilitation equipment and methods to help patients regain mobility and improve quality of life.",
      shortDescription:
        "Điều trị cột sống, gân khớp và phục hồi chức năng vận động với công nghệ hiện đại.",
      shortDescriptionEn:
        "Treatment of spine, tendons, joints and functional mobility rehabilitation with modern technology.",
      keywords:
        "phục hồi chức năng, đau cột sống, viêm khớp, đau thần kinh tọa, thoát vị đĩa đệm, tennis elbow",
      enKeywords:
        "functional rehabilitation, spinal pain, joint inflammation, sciatica, herniated disc, tennis elbow",
      status: "PUBLISHED",
    },
    {
      title: "HÀNH TRÌNH ÊM ÁI",
      titleEn: "Comfortable Journey",
      slug: "hanh-trinh-em-ai",
      description:
        "Tận hưởng trọn vẹn sự thư thái sau liệu trình tại Healthcare Therapy Center mà không cần lo lắng về việc di chuyển bởi dịch vụ đưa đón tận nơi. Chúng tôi hiểu rằng việc di chuyển có thể khó khăn đối với một số bệnh nhân, đặc biệt là những người đang trong quá trình điều trị và phục hồi. Vì vậy, dịch vụ đưa đón của chúng tôi được thiết kế để mang lại sự tiện lợi tối đa và an toàn cho khách hàng.",
      descriptionEn:
        "Enjoy complete relaxation after treatment at Healthcare Therapy Center without worrying about transportation with our door-to-door pickup service. We understand that transportation can be difficult for some patients, especially those undergoing treatment and recovery. Therefore, our transportation service is designed to provide maximum convenience and safety for customers.",
      shortDescription:
        "Dịch vụ đưa đón tận nơi, đảm bảo sự tiện lợi và an toàn cho khách hàng.",
      shortDescriptionEn:
        "Door-to-door transportation service, ensuring convenience and safety for customers.",
      keywords:
        "dịch vụ đưa đón, tiện lợi, an toàn, hành trình êm ái, chăm sóc khách hàng",
      enKeywords:
        "transportation service, convenience, safety, comfortable journey, customer care",
      status: "PUBLISHED",
    },
    {
      title: "CHĂM SÓC SỨC KHỎE TOÀN DIỆN",
      titleEn: "Comprehensive Healthcare",
      slug: "cham-soc-suc-khoe-toan-dien",
      description:
        "Không chỉ nhằm mục đích điều trị sau khi các triệu chứng xuất hiện, mà là phòng ngừa ngay từ ban đầu để duy trì và nâng cao chất lượng cuộc sống của bạn. Thông qua các chương trình tư vấn, kiểm tra và chăm sóc được cá nhân hóa, chúng tôi đồng hành cùng bạn trên hành trình chăm sóc sức khỏe. Mục tiêu của chúng tôi là tạo ra một kế hoạch chăm sóc sức khỏe toàn diện, bao gồm cả việc phòng ngừa bệnh tật và duy trì sức khỏe tối ưu.",
      descriptionEn:
        "Not only aimed at treatment after symptoms appear, but prevention from the beginning to maintain and improve your quality of life. Through personalized consultation, examination and care programs, we accompany you on your healthcare journey. Our goal is to create a comprehensive healthcare plan that includes both disease prevention and optimal health maintenance.",
      shortDescription:
        "Chương trình chăm sóc sức khỏe toàn diện với tư vấn và kiểm tra được cá nhân hóa.",
      shortDescriptionEn:
        "Comprehensive healthcare program with personalized consultation and examination.",
      keywords:
        "chăm sóc sức khỏe, phòng ngừa bệnh, tư vấn cá nhân, kiểm tra sức khỏe, chất lượng cuộc sống",
      enKeywords:
        "healthcare, disease prevention, personal consultation, health checkup, quality of life",
      status: "PUBLISHED",
    },
  ];

  for (const service of servicesData) {
    const createdService = await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
    console.log(`Created service with id: ${createdService.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
