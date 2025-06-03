const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // First, let's create some Media records for feature images
  const mediaRecords = await Promise.all([
    prisma.media.create({
      data: {
        url: "/images/service_1.png",
        fileName: "service_1.png",
        originalName: "Y học cổ truyền.png",
        fileType: "image/png",
        fileSize: 156000,
      },
    }),
    prisma.media.create({
      data: {
        url: "/images/service_2.png",
        fileName: "service_2.png",
        originalName: "Vật lý trị liệu.png",
        fileType: "image/png",
        fileSize: 178000,
      },
    }),
    prisma.media.create({
      data: {
        url: "/images/service_3.png",
        fileName: "service_3.png",
        originalName: "Phục hồi chức năng.png",
        fileType: "image/png",
        fileSize: 165000,
      },
    }),
    prisma.media.create({
      data: {
        url: "/images/service_4.png",
        fileName: "service_4.png",
        originalName: "Dịch vụ đưa đón.png",
        fileType: "image/png",
        fileSize: 143000,
      },
    }),
    prisma.media.create({
      data: {
        url: "/images/service_5.jpg",
        fileName: "service_5.jpg",
        originalName: "Massage therapy.jpg",
        fileType: "image/jpeg",
        fileSize: 189000,
      },
    }),
    prisma.media.create({
      data: {
        url: "/images/service_6.jpg",
        fileName: "service_6.jpg",
        originalName: "Acupuncture.jpg",
        fileType: "image/jpeg",
        fileSize: 172000,
      },
    }),
    prisma.media.create({
      data: {
        url: "/images/service_7.jpg",
        fileName: "service_7.jpg",
        originalName: "Nutrition consultation.jpg",
        fileType: "image/jpeg",
        fileSize: 134000,
      },
    }),
    prisma.media.create({
      data: {
        url: "/images/service_8.jpg",
        fileName: "service_8.jpg",
        originalName: "Mental health.jpg",
        fileType: "image/jpeg",
        fileSize: 198000,
      },
    }),
    prisma.media.create({
      data: {
        url: "/images/service_9.jpg",
        fileName: "service_9.jpg",
        originalName: "Elderly care.jpg",
        fileType: "image/jpeg",
        fileSize: 167000,
      },
    }),
    prisma.media.create({
      data: {
        url: "/images/service_10.jpg",
        fileName: "service_10.jpg",
        originalName: "Home care.jpg",
        fileType: "image/jpeg",
        fileSize: 154000,
      },
    }),
  ]);

  // Create 10 mock services
  const services = [
    {
      slug: "ortho",
      title: "Y HỌC CỔ TRUYỀN",
      description:
        "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại hệ thống nội tạng, giúp cơ thể tự phục hồi và duy trì sức khỏe tối ưu.",
      featureImageId: mediaRecords[0].id,
    },
    {
      slug: "rehab",
      title: "ĐIỀU TRỊ VẬT LÝ TRỊ LIỆU CÔNG NGHỆ CAO",
      description:
        "Healthcare Therapy Center áp dụng những công nghệ vật lý trị liệu tiên tiến, hiện đại nhằm tối đa hóa khả năng điều trị, phục hồi của khách hàng. Các công nghệ Laser công suất cao, Sóng cao tần Radio Frequency (RF), Sóng xung kích Shockwave được chứng minh qua nhiều nghiên cứu khoa học trên thế giới là hiệu quả trong việc giảm đau, kích thích tái tạo tế bào và phục hồi chức năng vận động.",
      featureImageId: mediaRecords[1].id,
    },
    {
      slug: "func",
      title: "PHỤC HỒI CHỨC NĂNG CÔNG NGHỆ CAO",
      description:
        "Điều trị các bệnh về cột sống như đau cổ-lưng, đau thần kinh tọa, thoát vị đĩa đệm...; Các bệnh lý về gân - khớp như: viêm chop xoay, đau khớp gối, khớp cổ tay, gai gót chân; hội chứng ống cổ tay, viêm gân duỗi ngón cái, tenis elbow…; Các tình trạng căng mỏi cơ cấp - mạn tính. Sử dụng thiết bị hiện đại và phương pháp điều trị cá nhân hóa.",
      featureImageId: mediaRecords[2].id,
    },
    {
      slug: "transport",
      title: "HÀNH TRÌNH ÊM ÁI",
      description:
        "Tận hưởng trọn vẹn sự thư thái sau liệu trình tại Healthcare Therapy Center mà không cần lo lắng về việc di chuyển bởi dịch vụ đưa đón tận nơi. Với đội xe hiện đại, thoải mái và đội ngũ tài xế chuyên nghiệp, chúng tôi đảm bảo hành trình an toàn và êm ái cho mọi khách hàng.",
      featureImageId: mediaRecords[3].id,
    },
    {
      slug: "massage-therapy",
      title: "LIỆU PHÁP MASSAGE CHUYÊN SÂU",
      description:
        "Liệu pháp massage trị liệu kết hợp các kỹ thuật cổ truyền và hiện đại, giúp giảm căng thẳng, cải thiện tuần hoàn máu, thư giãn cơ bắp và tăng cường sức khỏe tổng thể. Đội ngũ massage trị liệu viên được đào tạo chuyên nghiệp với nhiều năm kinh nghiệm.",
      featureImageId: mediaRecords[4].id,
    },
    {
      slug: "acupuncture",
      title: "CHÂM CỨU Y HỌC CỔ TRUYỀN",
      description:
        "Phương pháp châm cứu truyền thống được áp dụng để điều trị các bệnh lý về thần kinh, cơ xương khớp, tiêu hóa và các vấn đề sức khỏe khác. Sử dụng kim vô trùng, an toàn tuyệt đối với quy trình nghiêm ngặt theo tiêu chuẩn y tế.",
      featureImageId: mediaRecords[5].id,
    },
    {
      slug: "nutrition-consultation",
      title: "TƯ VẤN DINH DƯỠNG CHUYÊN NGHIỆP",
      description:
        "Dịch vụ tư vấn dinh dưỡng cá nhân hóa, xây dựng chế độ ăn uống phù hợp với tình trạng sức khỏe và mục tiêu của từng khách hàng. Đội ngũ chuyên gia dinh dưỡng giàu kinh nghiệm sẽ đồng hành cùng bạn trong hành trình cải thiện sức khỏe.",
      featureImageId: mediaRecords[6].id,
    },
    {
      slug: "mental-health",
      title: "CHĂM SÓC SỨC KHỎE TINH THẦN",
      description:
        "Dịch vụ tư vấn tâm lý và hỗ trợ sức khỏe tinh thần, giúp khách hàng vượt qua stress, lo âu, trầm cảm và các vấn đề tâm lý khác. Áp dụng các phương pháp trị liệu hiện đại và an toàn trong môi trường thân thiện, thoải mái.",
      featureImageId: mediaRecords[7].id,
    },
    {
      slug: "elderly-care",
      title: "CHĂM SÓC NGƯỜI CAO TUỔI",
      description:
        "Dịch vụ chăm sóc sức khỏe toàn diện dành riêng cho người cao tuổi, bao gồm kiểm tra sức khỏe định kỳ, vật lý trị liệu, dinh dưỡng và hỗ trợ sinh hoạt hàng ngày. Đội ngũ chăm sóc được đào tạo chuyên biệt về geriatrics.",
      featureImageId: mediaRecords[8].id,
    },
    {
      slug: "home-care",
      title: "CHĂM SÓC TẠI NHÀ",
      description:
        "Dịch vụ chăm sóc sức khỏe tại nhà cho những khách hàng không thể di chuyển đến trung tâm. Bao gồm các dịch vụ điều dưỡng, vật lý trị liệu, châm cứu và chăm sóc cá nhân. Đội ngũ y tế sẽ đến tận nhà với đầy đủ thiết bị chuyên dụng.",
      featureImageId: mediaRecords[9].id,
    },
  ];

  // Create all services
  for (const service of services) {
    await prisma.service.create({
      data: service,
    });
  }

  console.log("✅ Successfully seeded 10 services with feature images!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
