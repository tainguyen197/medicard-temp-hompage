import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedNews() {
  try {
    console.log("Start seeding news articles...");

    // First, ensure we have categories to associate with news
    const traditionalMedicineCategory = await prisma.category.upsert({
      where: { slug: "traditional-medicine" },
      update: {},
      create: {
        name: "Y học cổ truyền",
        slug: "traditional-medicine",
        description: "Các bài viết về y học cổ truyền, châm cứu, xoa bóp",
      },
    });

    const physicalTherapyCategory = await prisma.category.upsert({
      where: { slug: "physical-therapy" },
      update: {},
      create: {
        name: "Vật lý trị liệu",
        slug: "physical-therapy", 
        description: "Thông tin về vật lý trị liệu và phục hồi chức năng",
      },
    });

    const spinalHealthCategory = await prisma.category.upsert({
      where: { slug: "spinal-health" },
      update: {},
      create: {
        name: "Sức khỏe cột sống",
        slug: "spinal-health",
        description: "Các bài viết về chăm sóc và điều trị cột sống",
      },
    });

    // News articles based on https://htcwellness.com/news
    const newsData = [
      {
        title: "Chiro Therapy trong điều trị các vấn đề về cột sống",
        titleEn: "Chiro Therapy in Treating Spinal Issues",
        slug: "chiro-therapy-trong-dieu-tri-cac-van-de-ve-cot-song",
        description: `Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại các yếu tố Âm - Dương bên trong cơ thể.

Chiro Therapy là một phương pháp điều trị hiện đại kết hợp với y học cổ truyền, giúp điều chỉnh cấu trúc cột sống và hệ thần kinh. Phương pháp này đặc biệt hiệu quả trong việc điều trị các vấn đề về đau lưng, đau cổ, thoát vị đĩa đệm và các rối loạn chức năng cột sống khác.

Tại Healthcare Therapy Center, chúng tôi áp dụng kỹ thuật Chiro Therapy một cách an toàn và chính xác, được thực hiện bởi các chuyên gia có kinh nghiệm lâu năm trong lĩnh vực này.`,
        descriptionEn: `Preserving community health with the essence of the nation: Natural medicines flexibly adjusted for different cases, combined with other traditional medicine treatment methods such as acupuncture, massage, acupressure... with the main goal of focusing on adjusting and rebalancing the Yin-Yang factors inside the body.

Chiro Therapy is a modern treatment method combined with traditional medicine, helping to adjust spinal structure and nervous system. This method is particularly effective in treating back pain, neck pain, herniated disc and other spinal dysfunction problems.

At Healthcare Therapy Center, we apply Chiro Therapy techniques safely and accurately, performed by experts with many years of experience in this field.`,
        shortDescription: "Phương pháp Chiro Therapy kết hợp y học cổ truyền trong điều trị các vấn đề về cột sống một cách hiệu quả và an toàn.",
        shortDescriptionEn: "Chiro Therapy method combined with traditional medicine for effective and safe treatment of spinal issues.",
        status: "PUBLISHED",
        showOnHomepage: true,
        pin: true,
        categoryId: spinalHealthCategory.id,
        metaTitle: "Chiro Therapy điều trị cột sống hiệu quả | Healthcare Therapy Center",
        metaTitleEn: "Effective Chiro Therapy for Spine Treatment | Healthcare Therapy Center",
        metaDescription: "Tìm hiểu về phương pháp Chiro Therapy kết hợp y học cổ truyền trong điều trị các vấn đề về cột sống tại HTC",
        metaDescriptionEn: "Learn about Chiro Therapy method combined with traditional medicine for spinal treatment at HTC",
        metaKeywords: "chiro therapy, điều trị cột sống, y học cổ truyền, đau lưng, đau cổ, thoát vị đĩa đệm",
        metaKeywordsEn: "chiro therapy, spinal treatment, traditional medicine, back pain, neck pain, herniated disc",
      },
      {
        title: "Lợi ích của châm cứu trong y học cổ truyền",
        titleEn: "Benefits of Acupuncture in Traditional Medicine",
        slug: "loi-ich-cua-cham-cuu-trong-y-hoc-co-truyen",
        description: `Châm cứu là một trong những phương pháp điều trị cổ xưa và hiệu quả nhất trong y học cổ truyền Việt Nam. Được truyền từ hàng ngàn năm nay, phương pháp này không chỉ giúp giảm đau mà còn cân bằng lại năng lượng trong cơ thể, tăng cường hệ miễn dịch và cải thiện tuần hoàn máu.

Tại Healthcare Therapy Center, châm cứu được thực hiện bởi các bác sĩ có chuyên môn cao và kinh nghiệm lâu năm. Chúng tôi sử dụng kim châm cứu chất lượng cao, tuân thủ nghiêm ngặt các quy trình vệ sinh và an toàn y tế.

Châm cứu đặc biệt hiệu quả trong điều trị các bệnh lý về cơ xương khớp, rối loạn giấc ngủ, căng thẳng, lo âu và nhiều vấn đề sức khỏe khác.`,
        descriptionEn: `Acupuncture is one of the oldest and most effective treatment methods in Vietnamese traditional medicine. Passed down for thousands of years, this method not only helps reduce pain but also rebalances energy in the body, strengthens the immune system, and improves blood circulation.

At Healthcare Therapy Center, acupuncture is performed by highly qualified doctors with many years of experience. We use high-quality acupuncture needles, strictly following hygiene and medical safety procedures.

Acupuncture is particularly effective in treating musculoskeletal diseases, sleep disorders, stress, anxiety and many other health problems.`,
        shortDescription: "Châm cứu - phương pháp y học cổ truyền hiệu quả trong cân bằng năng lượng, giảm đau và tăng cường sức khỏe.",
        shortDescriptionEn: "Acupuncture - effective traditional medicine method for energy balance, pain relief and health enhancement.",
        status: "PUBLISHED",
        showOnHomepage: true,
        pin: false,
        categoryId: traditionalMedicineCategory.id,
        metaTitle: "Châm cứu y học cổ truyền hiệu quả | Healthcare Therapy Center",
        metaTitleEn: "Effective Traditional Acupuncture | Healthcare Therapy Center",
        metaDescription: "Tìm hiểu lợi ích của châm cứu trong y học cổ truyền, phương pháp điều trị an toàn và hiệu quả tại HTC",
        metaDescriptionEn: "Learn about the benefits of acupuncture in traditional medicine, safe and effective treatment method at HTC",
        metaKeywords: "châm cứu, y học cổ truyền, cân bằng năng lượng, giảm đau, tăng cường miễn dịch",
        metaKeywordsEn: "acupuncture, traditional medicine, energy balance, pain relief, immune enhancement",
      },
      {
        title: "Xoa bóp bấm huyệt - Nghệ thuật chữa lành truyền thống",
        titleEn: "Massage and Acupressure - Traditional Healing Art",
        slug: "xoa-bop-bam-huyet-nghe-thuat-chua-lanh-truyen-thong",
        description: `Xoa bóp bấm huyệt là một phần không thể thiếu trong hệ thống y học cổ truyền Việt Nam. Phương pháp này kết hợp giữa các kỹ thuật xoa bóp để thư giãn cơ bắp và kỹ thuật bấm huyệt để kích thích các điểm huyệt trên cơ thể.

Theo triết lý y học cổ truyền, cơ thể con người có hệ thống kinh lạc chạy suốt từ đầu đến chân. Khi các kinh lạc bị tắc nghẽn, sẽ gây ra các vấn đề sức khỏe. Xoa bóp bấm huyệt giúp thông thoáng kinh lạc, lưu thông khí huyết, từ đó cải thiện sức khỏe tổng thể.

Tại Healthcare Therapy Center, các kỹ thuật viên của chúng tôi được đào tạo bài bản về giải phẫu, sinh lý học và các kỹ thuật xoa bóp bấm huyệt truyền thống.`,
        descriptionEn: `Massage and acupressure is an indispensable part of the Vietnamese traditional medicine system. This method combines massage techniques to relax muscles and acupressure techniques to stimulate acupoints on the body.

According to traditional medicine philosophy, the human body has a meridian system running from head to toe. When meridians are blocked, health problems occur. Massage and acupressure help clear meridians, circulate qi and blood, thereby improving overall health.

At Healthcare Therapy Center, our technicians are professionally trained in anatomy, physiology and traditional massage acupressure techniques.`,
        shortDescription: "Xoa bóp bấm huyệt giúp thông thoáng kinh lạc, lưu thông khí huyết và cải thiện sức khỏe tổng thể.",
        shortDescriptionEn: "Massage and acupressure help clear meridians, circulate qi and blood, and improve overall health.",
        status: "PUBLISHED",
        showOnHomepage: true,
        pin: false,
        categoryId: traditionalMedicineCategory.id,
        metaTitle: "Xoa bóp bấm huyệt truyền thống | Healthcare Therapy Center",
        metaTitleEn: "Traditional Massage and Acupressure | Healthcare Therapy Center",
        metaDescription: "Khám phá lợi ích của xoa bóp bấm huyệt trong y học cổ truyền, phương pháp thông thoáng kinh lạc hiệu quả",
        metaDescriptionEn: "Discover the benefits of massage and acupressure in traditional medicine, effective meridian clearing method",
        metaKeywords: "xoa bóp bấm huyệt, kinh lạc, khí huyết, y học cổ truyền, thư giãn",
        metaKeywordsEn: "massage acupressure, meridian, qi blood, traditional medicine, relaxation",
      },
      {
        title: "Vật lý trị liệu hiện đại trong phục hồi chức năng",
        titleEn: "Modern Physical Therapy in Functional Rehabilitation",
        slug: "vat-ly-tri-lieu-hien-dai-trong-phuc-hoi-chuc-nang",
        description: `Vật lý trị liệu hiện đại là sự kết hợp hoàn hảo giữa khoa học y học và công nghệ tiên tiến. Tại Healthcare Therapy Center, chúng tôi áp dụng các phương pháp vật lý trị liệu hiện đại nhất để giúp bệnh nhân phục hồi chức năng một cách nhanh chóng và hiệu quả.

Các thiết bị vật lý trị liệu hiện đại như máy laser công suất cao, máy sóng xung kích (Shockwave), máy điện trị liệu và các thiết bị tập luyện phục hồi chức năng được sử dụng để điều trị các vấn đề về cơ xương khớp, phục hồi sau chấn thương và cải thiện khả năng vận động.

Đội ngũ vật lý trị liệu viên của chúng tôi được đào tạo chuyên sâu về các kỹ thuật hiện đại và có kinh nghiệm trong việc xây dựng chương trình phục hồi chức năng cá nhân hóa cho từng bệnh nhân.`,
        descriptionEn: `Modern physical therapy is the perfect combination of medical science and advanced technology. At Healthcare Therapy Center, we apply the most modern physical therapy methods to help patients recover function quickly and effectively.

Modern physical therapy equipment such as high-power laser machines, shockwave therapy devices, electrotherapy machines and functional rehabilitation training equipment are used to treat musculoskeletal problems, post-injury recovery and improve mobility.

Our physical therapy team is specially trained in modern techniques and has experience in building personalized rehabilitation programs for each patient.`,
        shortDescription: "Vật lý trị liệu hiện đại kết hợp công nghệ tiên tiến giúp phục hồi chức năng nhanh chóng và hiệu quả.",
        shortDescriptionEn: "Modern physical therapy combines advanced technology for quick and effective functional recovery.",
        status: "PUBLISHED",
        showOnHomepage: true,
        pin: false,
        categoryId: physicalTherapyCategory.id,
        metaTitle: "Vật lý trị liệu hiện đại | Healthcare Therapy Center",
        metaTitleEn: "Modern Physical Therapy | Healthcare Therapy Center",
        metaDescription: "Tìm hiểu về vật lý trị liệu hiện đại với công nghệ tiên tiến trong phục hồi chức năng tại HTC",
        metaDescriptionEn: "Learn about modern physical therapy with advanced technology for functional rehabilitation at HTC",
        metaKeywords: "vật lý trị liệu, phục hồi chức năng, laser, shockwave, điện trị liệu",
        metaKeywordsEn: "physical therapy, functional rehabilitation, laser, shockwave, electrotherapy",
      },
      {
        title: "Điều trị đau thần kinh tọa bằng phương pháp tổng hợp",
        titleEn: "Comprehensive Sciatica Treatment Method",
        slug: "dieu-tri-dau-than-kinh-toa-bang-phuong-phap-tong-hop",
        description: `Đau thần kinh tọa là một trong những vấn đề phổ biến nhất về cột sống, ảnh hưởng đến chất lượng cuộc sống của nhiều người. Tại Healthcare Therapy Center, chúng tôi áp dụng phương pháp điều trị tổng hợp kết hợp giữa y học cổ truyền và công nghệ hiện đại.

Phương pháp điều trị bao gồm:
- Y học cổ truyền: Sử dụng thuốc thảo dược tự nhiên, châm cứu, xoa bóp bấm huyệt
- Công nghệ hiện đại: Liệu pháp sóng xung kích (Shockwave), điện trị liệu, laser công suất cao
- Vật lý trị liệu: Các bài tập phục hồi chức năng được thiết kế riêng
- Tư vấn lối sống: Hướng dẫn tư thế ngồi, đứng, nằm đúng cách

Sự kết hợp này giúp không chỉ giảm đau nhanh chóng mà còn điều trị tận gốc nguyên nhân, ngăn ngừa tái phát.`,
        descriptionEn: `Sciatica is one of the most common spinal problems, affecting the quality of life of many people. At Healthcare Therapy Center, we apply a comprehensive treatment method combining traditional medicine and modern technology.

Treatment methods include:
- Traditional medicine: Using natural herbal medicines, acupuncture, massage acupressure
- Modern technology: Shockwave therapy, electrotherapy, high-power laser
- Physical therapy: Specially designed functional rehabilitation exercises
- Lifestyle counseling: Guidance on proper sitting, standing, lying postures

This combination helps not only quickly relieve pain but also treat the root cause, preventing recurrence.`,
        shortDescription: "Điều trị đau thần kinh tọa tổng hợp kết hợp y học cổ truyền và công nghệ hiện đại.",
        shortDescriptionEn: "Comprehensive sciatica treatment combining traditional medicine and modern technology.",
        status: "PUBLISHED",
        showOnHomepage: false,
        pin: false,
        categoryId: spinalHealthCategory.id,
        metaTitle: "Điều trị đau thần kinh tọa hiệu quả | Healthcare Therapy Center",
        metaTitleEn: "Effective Sciatica Treatment | Healthcare Therapy Center",
        metaDescription: "Phương pháp điều trị đau thần kinh tọa tổng hợp, kết hợp y học cổ truyền và công nghệ hiện đại tại HTC",
        metaDescriptionEn: "Comprehensive sciatica treatment method combining traditional medicine and modern technology at HTC",
        metaKeywords: "đau thần kinh tọa, điều trị cột sống, shockwave, châm cứu, laser",
        metaKeywordsEn: "sciatica, spinal treatment, shockwave, acupuncture, laser",
      },
      {
        title: "Cân bằng Âm Dương - Triết lý cốt lõi của y học cổ truyền",
        titleEn: "Yin Yang Balance - Core Philosophy of Traditional Medicine",
        slug: "can-bang-am-duong-triet-ly-cot-loi-cua-y-hoc-co-truyen",
        description: `Theo triết lý y học cổ truyền, sức khỏe con người phụ thuộc vào sự cân bằng giữa Âm và Dương trong cơ thể. Khi hai yếu tố này mất cân bằng, cơ thể sẽ xuất hiện các vấn đề sức khỏe.

Âm và Dương không chỉ là hai khái niệm trừu tượng mà còn thể hiện qua các chức năng sinh lý cụ thể:
- Âm: Đại diện cho sự tĩnh lặng, mát mẻ, tiêu hóa, ngủ nghỉ
- Dương: Đại diện cho sự năng động, ấm áp, tuần hoàn, tỉnh táo

Tại Healthcare Therapy Center, chúng tôi áp dụng các phương pháp điều trị nhằm điều chỉnh và cân bằng lại Âm Dương trong cơ thể thông qua:
- Sử dụng thuốc thảo dược có tính chất Âm hoặc Dương phù hợp
- Châm cứu vào các huyệt đạo để điều hòa khí huyết
- Xoa bóp bấm huyệt để kích thích tuần hoàn năng lượng`,
        descriptionEn: `According to traditional medicine philosophy, human health depends on the balance between Yin and Yang in the body. When these two elements are imbalanced, the body will experience health problems.

Yin and Yang are not just abstract concepts but are also manifested through specific physiological functions:
- Yin: Represents stillness, coolness, digestion, rest
- Yang: Represents activity, warmth, circulation, alertness

At Healthcare Therapy Center, we apply treatment methods to adjust and rebalance Yin and Yang in the body through:
- Using herbal medicines with appropriate Yin or Yang properties
- Acupuncture at acupoints to regulate qi and blood
- Massage acupressure to stimulate energy circulation`,
        shortDescription: "Tìm hiểu về triết lý cân bằng Âm Dương trong y học cổ truyền và ứng dụng trong điều trị.",
        shortDescriptionEn: "Learn about the Yin Yang balance philosophy in traditional medicine and its application in treatment.",
        status: "PUBLISHED",
        showOnHomepage: false,
        pin: false,
        categoryId: traditionalMedicineCategory.id,
        metaTitle: "Cân bằng Âm Dương trong y học cổ truyền | HTC",
        metaTitleEn: "Yin Yang Balance in Traditional Medicine | HTC",
        metaDescription: "Khám phá triết lý cân bằng Âm Dương trong y học cổ truyền và ứng dụng điều trị tại Healthcare Therapy Center",
        metaDescriptionEn: "Explore the Yin Yang balance philosophy in traditional medicine and treatment applications at Healthcare Therapy Center",
        metaKeywords: "âm dương, cân bằng, y học cổ truyền, khí huyết, thuốc thảo dược",
        metaKeywordsEn: "yin yang, balance, traditional medicine, qi blood, herbal medicine",
      },
    ];

    // Create news articles
    for (const news of newsData) {
      const createdNews = await prisma.news.upsert({
        where: { slug: news.slug },
        update: news,
        create: news,
      });
      console.log(`✅ Created/Updated news: ${createdNews.title}`);
    }

    console.log("✅ News seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding news:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedNews()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 