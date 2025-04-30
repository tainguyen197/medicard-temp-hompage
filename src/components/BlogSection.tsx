import React from "react";
import Image from "next/image";
import Link from "next/link";

interface BlogPostProps {
  image: string;
  title: string;
  excerpt: string;
}

const BlogPost = ({ image, title, excerpt }: BlogPostProps) => (
  <div className="bg-white ">
    <div className="relative h-64 rounded-2xl overflow-hidden">
      <Image src={image} alt={title} fill className="object-cover" />
    </div>
    <div className="pt-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600">{excerpt}</p>
    </div>
  </div>
);

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      image: "/images/blog1.jpg",
      title: "Chiro Therapy trong điều trị các vấn đề về cột sống",
      excerpt:
        "Hiểu về phương pháp Chiropractic - giải pháp điều trị hiệu quả các vấn đề cột sống mà không cần phẫu thuật hay thuốc giảm đau.",
    },
    {
      id: 2,
      image: "/images/blog2.jpg",
      title: "Phương pháp giảm đau không dùng thuốc cho đau lưng mãn tính",
      excerpt:
        "Khám phá các kỹ thuật và liệu pháp tự nhiên giúp giảm đau lưng mãn tính, an toàn và hiệu quả dài lâu.",
    },
    {
      id: 3,
      image: "/images/blog3.jpg",
      title: "Tập luyện đúng cách để phòng ngừa chấn thương cơ xương khớp",
      excerpt:
        "Hướng dẫn chi tiết về kỹ thuật tập luyện an toàn, giúp phòng ngừa chấn thương và duy trì sức khoẻ cơ xương khớp.",
    },
  ];

  return (
    <section id="blog" className="pb-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-cormorant font-bold text-center text-gray-900 mb-16">
          BLOG SỨC KHỎE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogPost
              key={post.id}
              image={post.image}
              title={post.title}
              excerpt={post.excerpt}
            />
          ))}
        </div>

        <div className="text-right mt-12">
          <Link
            href="/blog"
            className="inline-block bg-[#B1873F] hover:bg-amber-800 text-white font-semibold py-3 px-8 rounded-full"
          >
            Xem thêm
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
