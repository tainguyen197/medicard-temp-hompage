export interface TeamMemberData {
  id: string;
  name: string;
  nameEn?: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  image: string;
  order?: number;
  status?: string;
}

export const defaultTeamMembers: TeamMemberData[] = [
  {
    id: "nguyen-thi-hong-hanh",
    name: "NGUYỄN THỊ HỒNG HẠNH",
    nameEn: "NGUYEN THI HONG HANH",
    title: "BS. CK",
    titleEn: "MD. Specialist",
    description:
      "Nhiều năm kinh nghiệm trong lĩnh vực Vật Lý Trị Liệu - Phục Hồi Chức Năng",
    descriptionEn:
      "Many years of experience in the field of Physical Therapy - Functional Rehabilitation",
    image: "/images/doctor4.jpg",
    order: 1,
    status: "ACTIVE",
  },
  {
    id: "nguyen-van-thinh",
    name: "NGUYỄN VĂN THỊNH",
    nameEn: "NGUYEN VAN THINH",
    title: "BS. CK",
    titleEn: "MD. Specialist",
    description:
      "Hơn 15 năm trong lĩnh vực Phục Hồi Chức Năng và Nội Cơ Xương Khớp, Y Học Cổ Truyền, có kinh nghiệm điều trị những trường hợp khó và phức tạp",
    descriptionEn:
      "Over 15 years in the field of Functional Rehabilitation and Internal Medicine Musculoskeletal, Traditional Medicine, with experience treating difficult and complex cases",
    image: "/images/doctor3.jpg",
    order: 2,
    status: "ACTIVE",
  },
  {
    id: "nguyen-thi-mai-linh",
    name: "NGUYỄN THỊ MAI LINH",
    nameEn: "NGUYEN THI MAI LINH",
    title: "THS. BS",
    titleEn: "MSc. MD",
    description:
      "Thành viên chính thức của hiệp hội Trị liệu Cột sống Thần Kinh Chiropractic tại Úc. Thạc sĩ - Bác sĩ Mai Linh đảm nhiệm vai trò Bác sĩ lâm sàng tại nhiều quốc gia tiên tiến trên thế giới như: Úc, Singapore, Việt Nam.",
    descriptionEn:
      "Official member of the Chiropractic Neurological Spinal Therapy Association in Australia. Master - Doctor Mai Linh serves as a Clinical Doctor in many advanced countries around the world such as: Australia, Singapore, Vietnam.",
    image: "/images/doctor2.jpg",
    order: 3,
    status: "ACTIVE",
  },
  {
    id: "doan-hai-yen",
    name: "ĐOÀN HẢI YẾN",
    nameEn: "DOAN HAI YEN",
    title: "BS. CK",
    titleEn: "MD. Specialist",
    description:
      "Bác sĩ Đoàn Hải Yến có kinh nghiệm chuyên sâu trong lĩnh vực Cơ Xương Khớp - Phục hồi cơ thể.",
    descriptionEn:
      "Dr. Doan Hai Yen has deep experience in the field of Musculoskeletal - Body rehabilitation.",
    image: "/images/doctor1.jpg",
    order: 4,
    status: "ACTIVE",
  },
];

// Utility functions for working with team data
export const getLocalizedTeamMember = (
  member: TeamMemberData,
  locale: string
) => {
  return {
    ...member,
    name: locale === "en" && member.nameEn ? member.nameEn : member.name,
    title: locale === "en" && member.titleEn ? member.titleEn : member.title,
    description:
      locale === "en" && member.descriptionEn
        ? member.descriptionEn
        : member.description,
  };
};

export const getActiveTeamMembers = (
  members: TeamMemberData[] = defaultTeamMembers
) => {
  return members
    .filter((member) => member.status === "ACTIVE")
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};

export const getTeamMemberById = (
  id: string,
  members: TeamMemberData[] = defaultTeamMembers
) => {
  return members.find((member) => member.id === id);
};
