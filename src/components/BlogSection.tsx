import React from "react";
import Image from "next/image";
import Link from "next/link";

interface BlogPostProps {
  image: string;
  title: string;
  excerpt: string;
  slug: string;
  id: number;
}

const BlogPost = ({ image, title, excerpt, slug, id }: BlogPostProps) => (
  <Link
    href={`/blog/${slug}`}
    key={id}
    className="group relative rounded-lg overflow-hidden max-w-[330px] mx-auto"
  >
    <div className="bg-white group grid grid-cols-2 gap-4 md:block">
      <div className="relative md:aspect-square max-h-[330px] rounded-2xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover h-[100px] group-hover:scale-105 transition-transform w-fit md:h-auto aspect-2/1"
        />
      </div>
      <div className="md:pt-6">
        <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-4 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm md:text-md line-clamp-2">
          {excerpt}
        </p>
      </div>
    </div>
  </Link>
);

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      slug: "chiro-therapy-trong-dieu-tri-cac-van-de-ve-cot-song",
      image: "/images/news1.jpg",
      title: "Chiro Therapy trong điều trị các vấn đề về cột sống",
      excerpt:
        "Hiểu về phương pháp Chiropractic - giải pháp điều trị hiệu quả các vấn đề cột sống mà không cần phẫu thuật hay thuốc giảm đau.",
    },
    {
      id: 2,
      slug: "phuong-phap-giam-dau-khong-dung-thuoc-cho-dau-luong-man-tinh",
      image: "/images/news2.jpg",
      title: "Phương pháp giảm đau không dùng thuốc cho đau lưng mãn tính",
      excerpt:
        "Khám phá các kỹ thuật và liệu pháp tự nhiên giúp giảm đau lưng mãn tính, an toàn và hiệu quả dài lâu.",
    },
    {
      id: 3,
      slug: "tap-luyen-dung-cach-de-phong-ngua-chan-thuong-co-xuong-khoc",
      image: "/images/news3.jpg",
      title: "Tập luyện đúng cách để phòng ngừa chấn thương cơ xương khớp",
      excerpt:
        "Hướng dẫn chi tiết về kỹ thuật tập luyện an toàn, giúp phòng ngừa chấn thương và duy trì sức khoẻ cơ xương khớp.",
    },
  ];

  return (
    <section id="news" className="pb-10 md:pb-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-xl md:text-5xl font-cormorant font-bold text-center text-gray-900 mb-8 md:mb-16 leading-tight">
          TIN TỨC
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-16">
          {blogPosts.map((post) => (
            <BlogPost
              key={post.id}
              slug={post.slug}
              id={post.id}
              image={post.image}
              title={post.title}
              excerpt={post.excerpt}
            />
          ))}
        </div>

        <div className="text-center md:text-right md:mt-12">
          <Link
            href="/news"
            className="bg-transparent inline-block md:bg-[#B1873F] hover:md:bg-amber-800 text-black md:text-white font-normal underline md:no-underline md:font-semibold py-3 px-8 rounded-full mt-2 md:mt-0"
          >
            Xem thêm
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
