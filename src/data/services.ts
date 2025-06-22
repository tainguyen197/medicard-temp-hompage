export interface ServiceData {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  details: string;
  detailsEn?: string;
  image: string;
  link: string;
  featured?: boolean;
  order?: number;
}

export const defaultServices: ServiceData[] = [
  {
    id: "traditional-medicine",
    title: "Y HỌC CỔ TRUYỀN",
    titleEn: "TRADITIONAL MEDICINE",
    description:
      "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại các yếu tố Âm - Dương bên trong cơ thể.",
    descriptionEn:
      "Preserving community health with national essence: Natural medicines flexibly adjusted according to each different case, combined with other traditional medicine treatment methods such as acupuncture, massage, acupressure,... with the main goal of focusing on adjusting and rebalancing the Yin-Yang factors inside the body.",
    details: "Châm cứu, Xoa bóp - Bấm huyệt, Thuốc thang",
    detailsEn: "Acupuncture, Massage - Acupressure, Herbal medicine",
    image: "/images/service_1.png",
    link: "/services/traditional-medicine",
    featured: true,
    order: 1,
  },
  {
    id: "physical-therapy",
    title: "ĐIỀU TRỊ VẬT LÝ TRỊ LIỆU CÔNG NGHỆ CAO",
    titleEn: "HIGH-TECH PHYSICAL THERAPY TREATMENT",
    description:
      "Healthcare Therapy Center áp dụng những công nghệ vật lý trị liệu tiên tiến, hiện đại nhằm tối đa hóa khả năng điều trị, phục hồi của khách hàng. Các công nghệ Laser công suất cao, Sóng cao tần Radio Frequency (RF), Sóng xung kích Shockwave được chứng minh qua nhiều nghiên cứu khoa học trên thế giới là hiệu quả cao trong việc điều trị các bệnh lý cơ xương khớp, giảm đau, đẩy nhanh tốc độ tái tạo và phục hồi.",
    descriptionEn:
      "Healthcare Therapy Center applies advanced, modern physical therapy technologies to maximize customers' treatment and recovery capabilities. High-power laser, Radio Frequency (RF), and Shockwave technologies have been proven through many scientific studies worldwide to be highly effective in treating musculoskeletal disorders, pain relief, and accelerating regeneration and recovery speed.",
    details:
      "Laser công suất cao, Radio Frequency (Sóng RF), Shockwave Therapy ( Sóng xung kích)",
    detailsEn:
      "High-power laser, Radio Frequency (RF waves), Shockwave Therapy",
    image: "/images/service_2.png",
    link: "/services/physical-therapy",
    featured: true,
    order: 2,
  },
  {
    id: "functional-rehabilitation",
    title: "PHỤC HỒI CHỨC NĂNG: CHUẨN ĐOÁN VÀ ĐIỀU TRỊ CHUYÊN SÂU",
    titleEn: "FUNCTIONAL REHABILITATION: SPECIALIZED DIAGNOSIS AND TREATMENT",
    description:
      "Điều trị các bệnh về cột sống như đau cổ-lưng, đau thần kinh tọa, thoát vị đĩa đệm...; Các bệnh lý về gân - khớp như: viêm chop xoay, đau khớp gối, khớp cổ tay, gai gót chân; hội chứng ống cổ tay, viêm gân duỗi ngón cái, tenis elbow…; Các tình trạng căng mỏi cơ cấp - mạn.",
    descriptionEn:
      "Treatment of spinal diseases such as neck-back pain, sciatica, herniated disc...; Tendon-joint disorders such as: rotator cuff inflammation, knee joint pain, wrist joint pain, heel spurs; carpal tunnel syndrome, thumb extensor tendonitis, tennis elbow...; Acute-chronic muscle strain conditions.",
    details:
      "Thăm khám, tư vấn, chẩn đoán và điều trị các bệnh lý cơ xương khớp, Sử dụng các máy móc vật lý trị liệu, Kỹ thuật viên có tay nghề chuyên môn cao",
    detailsEn:
      "Examination, consultation, diagnosis and treatment of musculoskeletal disorders, Using physical therapy machines and equipment, Skilled and highly specialized technicians",
    image: "/images/service_3.png",
    link: "/services/functional-rehabilitation",
    featured: true,
    order: 3,
  },
  {
    id: "transport-service",
    title: "LIỆU TRÌNH HOÀN HẢO, HÀNH TRÌNH ÊM ÁI",
    titleEn: "PERFECT TREATMENT, SMOOTH JOURNEY",
    description:
      "Tận hưởng trọn vẹn sự thư thái sau liệu trình tại Healthcare Therapy Center mà không cần lo lắng về việc di chuyển bởi dịch vụ đưa đón tận nơi.",
    descriptionEn:
      "Enjoy the complete relaxation after treatment at Healthcare Therapy Center without worrying about transportation with our delivery service.",
    details: "Xe đưa đón hiện đại, tiện nghi. Dịch vụ êm áí, thư thái.",
    detailsEn: "Modern, convenient vehicles. Smooth, relaxing service.",
    image: "/images/service_4.png",
    link: "/services/transport-service",
    featured: true,
    order: 4,
  },
];

// Utility functions for working with services data
export const getLocalizedService = (service: ServiceData, locale: string) => {
  return {
    ...service,
    title: locale === "en" && service.titleEn ? service.titleEn : service.title,
    description:
      locale === "en" && service.descriptionEn
        ? service.descriptionEn
        : service.description,
    details:
      locale === "en" && service.detailsEn
        ? service.detailsEn
        : service.details,
  };
};

export const getFeaturedServices = (
  services: ServiceData[] = defaultServices
) => {
  return services
    .filter((service) => service.featured)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};

export const getServiceById = (
  id: string,
  services: ServiceData[] = defaultServices
) => {
  return services.find((service) => service.id === id);
};
