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

  // Create sample news data based on htcwellness.com/news
  const newsData = [
    {
      title: "Chiro Therapy trong điều trị các vấn đề về cột sống",
      titleEn: "Chiro Therapy in Treating Spinal Issues",
      slug: "chiro-therapy-trong-dieu-tri-cac-van-de-ve-cot-song",
      description:
        "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại các yếu tố Âm - Dương bên trong cơ thể. Chiro Therapy là một phương pháp điều trị hiệu quả cho các vấn đề về cột sống, giúp giảm đau và cải thiện chức năng vận động một cách tự nhiên.",
      descriptionEn:
        "Preserving community health with the essence of the nation: Natural medicines flexibly adjusted for different cases, combined with other traditional medicine treatment methods such as acupuncture, massage, acupressure... with the main goal of focusing on adjusting and rebalancing the Yin-Yang factors inside the body. Chiro Therapy is an effective treatment method for spinal issues, helping to reduce pain and improve motor function naturally.",
      shortDescription:
        "Phương pháp Chiro Therapy hiệu quả trong điều trị các vấn đề về cột sống, kết hợp y học cổ truyền.",
      shortDescriptionEn:
        "Effective Chiro Therapy method for treating spinal issues, combined with traditional medicine.",
      status: "PUBLISHED",
      showOnHomepage: true,
      pin: true,
      categoryId: physicalRehabCategory.id,
      metaTitle: "Chiro Therapy điều trị cột sống hiệu quả | Healthcare Therapy Center",
      metaTitleEn: "Effective Chiro Therapy for Spine Treatment | Healthcare Therapy Center",
      metaDescription: "Tìm hiểu về phương pháp Chiro Therapy trong điều trị các vấn đề về cột sống tại Healthcare Therapy Center",
      metaDescriptionEn: "Learn about Chiro Therapy method for treating spinal issues at Healthcare Therapy Center",
      metaKeywords: "chiro therapy, điều trị cột sống, y học cổ truyền, châm cứu, xoa bóp",
      metaKeywordsEn: "chiro therapy, spinal treatment, traditional medicine, acupuncture, massage",
    },
    {
      title: "Công nghệ Laser cao cấp trong vật lý trị liệu",
      titleEn: "Advanced Laser Technology in Physical Therapy",
      slug: "cong-nghe-laser-cao-cap-trong-vat-ly-tri-lieu",
      description:
        "Healthcare Therapy Center tự hào ứng dụng công nghệ Laser công suất cao tiên tiến nhất trong điều trị vật lý trị liệu. Công nghệ này đã được chứng minh hiệu quả qua nhiều nghiên cứu khoa học trên thế giới, giúp giảm đau, tăng cường quá trình hồi phục và cải thiện chức năng vận động. Laser therapy không chỉ an toàn mà còn mang lại kết quả điều trị nhanh chóng và bền vững cho bệnh nhân.",
      descriptionEn:
        "Healthcare Therapy Center proudly applies the most advanced high-power Laser technology in physical therapy treatment. This technology has been proven effective through many scientific studies worldwide, helping to reduce pain, enhance recovery processes, and improve motor function. Laser therapy is not only safe but also provides quick and sustainable treatment results for patients.",
      shortDescription:
        "Ứng dụng công nghệ Laser công suất cao tiên tiến trong điều trị vật lý trị liệu hiệu quả.",
      shortDescriptionEn:
        "Application of advanced high-power Laser technology in effective physical therapy treatment.",
      status: "PUBLISHED",
      showOnHomepage: true,
      pin: false,
      categoryId: physicalRehabCategory.id,
      metaTitle: "Công nghệ Laser cao cấp vật lý trị liệu | HTC",
      metaTitleEn: "Advanced Laser Physical Therapy Technology | HTC",
      metaDescription: "Khám phá công nghệ Laser tiên tiến trong vật lý trị liệu tại Healthcare Therapy Center",
      metaDescriptionEn: "Discover advanced Laser technology in physical therapy at Healthcare Therapy Center",
      metaKeywords: "laser therapy, vật lý trị liệu, công nghệ cao, giảm đau",
      metaKeywordsEn: "laser therapy, physical therapy, high technology, pain relief",
    },
    {
      title: "Phương pháp điều trị tổng hợp cho đau thần kinh tọa",
      titleEn: "Comprehensive Treatment Method for Sciatica",
      slug: "phuong-phap-dieu-tri-tong-hop-cho-dau-than-kinh-toa",
      description:
        "Đau thần kinh tọa là một trong những vấn đề phổ biến về cột sống mà nhiều người gặp phải. Tại Healthcare Therapy Center, chúng tôi áp dụng phương pháp điều trị tổng hợp kết hợp giữa y học cổ truyền và công nghệ hiện đại. Từ việc sử dụng thuốc thảo dược tự nhiên, châm cứu, xoa bóp đến các công nghệ Shockwave và Radio Frequency, chúng tôi mang đến giải pháp điều trị toàn diện và hiệu quả cho bệnh nhân.",
      descriptionEn:
        "Sciatica is one of the common spinal problems that many people face. At Healthcare Therapy Center, we apply a comprehensive treatment method that combines traditional medicine and modern technology. From using natural herbal medicines, acupuncture, massage to Shockwave and Radio Frequency technologies, we provide comprehensive and effective treatment solutions for patients.",
      shortDescription:
        "Điều trị đau thần kinh tọa bằng phương pháp tổng hợp y học cổ truyền và công nghệ hiện đại.",
      shortDescriptionEn:
        "Treating sciatica with comprehensive traditional medicine and modern technology methods.",
      status: "PUBLISHED",
      showOnHomepage: false,
      pin: false,
      categoryId: physicalRehabCategory.id,
      metaTitle: "Điều trị đau thần kinh tọa hiệu quả | Healthcare Therapy Center",
      metaTitleEn: "Effective Sciatica Treatment | Healthcare Therapy Center",
      metaDescription: "Phương pháp điều trị đau thần kinh tọa tổng hợp tại Healthcare Therapy Center",
      metaDescriptionEn: "Comprehensive sciatica treatment method at Healthcare Therapy Center",
      metaKeywords: "đau thần kinh tọa, điều trị cột sống, shockwave, radio frequency",
      metaKeywordsEn: "sciatica, spinal treatment, shockwave, radio frequency",
    },
    {
      title: "Lợi ích của châm cứu trong y học cổ truyền",
      titleEn: "Benefits of Acupuncture in Traditional Medicine",
      slug: "loi-ich-cua-cham-cuu-trong-y-hoc-co-truyen",
      description:
        "Châm cứu là một trong những phương pháp điều trị cổ xưa và hiệu quả nhất trong y học cổ truyền Việt Nam. Phương pháp này không chỉ giúp giảm đau mà còn cân bằng lại năng lượng trong cơ thể, tăng cường hệ miễn dịch và cải thiện tuần hoàn máu. Tại Healthcare Therapy Center, đội ngũ bác sĩ có kinh nghiệm sẽ thực hiện châm cứu một cách an toàn và chính xác, mang lại hiệu quả điều trị tối ưu cho bệnh nhân.",
      descriptionEn:
        "Acupuncture is one of the oldest and most effective treatment methods in Vietnamese traditional medicine. This method not only helps reduce pain but also rebalances energy in the body, strengthens the immune system, and improves blood circulation. At Healthcare Therapy Center, experienced doctors will perform acupuncture safely and accurately, providing optimal treatment effectiveness for patients.",
      shortDescription:
        "Châm cứu - phương pháp y học cổ truyền hiệu quả trong cân bằng năng lượng và giảm đau.",
      shortDescriptionEn:
        "Acupuncture - effective traditional medicine method for energy balance and pain relief.",
      status: "PUBLISHED",
      showOnHomepage: true,
      pin: false,
      categoryId: mentalWellnessCategory.id,
      metaTitle: "Châm cứu y học cổ truyền hiệu quả | HTC",
      metaTitleEn: "Effective Traditional Acupuncture | HTC",
      metaDescription: "Tìm hiểu lợi ích của châm cứu trong y học cổ truyền tại Healthcare Therapy Center",
      metaDescriptionEn: "Learn about the benefits of acupuncture in traditional medicine at Healthcare Therapy Center",
      metaKeywords: "châm cứu, y học cổ truyền, cân bằng năng lượng, giảm đau",
      metaKeywordsEn: "acupuncture, traditional medicine, energy balance, pain relief",
    },
    {
      title: "Dịch vụ chăm sóc sức khỏe toàn diện tại HTC",
      titleEn: "Comprehensive Healthcare Services at HTC",
      slug: "dich-vu-cham-soc-suc-khoe-toan-dien-tai-htc",
      description:
        "Healthcare Therapy Center cam kết mang đến dịch vụ chăm sóc sức khỏe toàn diện, từ việc phòng ngừa bệnh tật đến điều trị và phục hồi chức năng. Chúng tôi không chỉ tập trung vào việc điều trị khi bệnh đã xuất hiện mà còn chú trọng đến việc duy trì và nâng cao sức khỏe của khách hàng. Với đội ngũ chuyên gia giàu kinh nghiệm và trang thiết bị hiện đại, HTC là địa chỉ tin cậy cho mọi nhu cầu chăm sóc sức khỏe của bạn.",
      descriptionEn:
        "Healthcare Therapy Center is committed to providing comprehensive healthcare services, from disease prevention to treatment and functional rehabilitation. We not only focus on treatment when disease has appeared but also pay attention to maintaining and improving customers' health. With experienced specialists and modern equipment, HTC is a trusted address for all your healthcare needs.",
      shortDescription:
        "Dịch vụ chăm sóc sức khỏe toàn diện từ phòng ngừa đến điều trị và phục hồi chức năng.",
      shortDescriptionEn:
        "Comprehensive healthcare services from prevention to treatment and functional rehabilitation.",
      status: "PUBLISHED",
      showOnHomepage: false,
      pin: false,
      categoryId: mentalWellnessCategory.id,
      metaTitle: "Dịch vụ chăm sóc sức khỏe toàn diện | Healthcare Therapy Center",
      metaTitleEn: "Comprehensive Healthcare Services | Healthcare Therapy Center",
      metaDescription: "Khám phá dịch vụ chăm sóc sức khỏe toàn diện tại Healthcare Therapy Center",
      metaDescriptionEn: "Discover comprehensive healthcare services at Healthcare Therapy Center",
      metaKeywords: "chăm sóc sức khỏe, phòng ngừa bệnh, điều trị, phục hồi chức năng",
      metaKeywordsEn: "healthcare, disease prevention, treatment, functional rehabilitation",
    },
  ];

  for (const news of newsData) {
    const createdNews = await prisma.news.upsert({
      where: { slug: news.slug },
      update: news,
      create: news,
    });
    console.log(`Created news with id: ${createdNews.id}`);
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
