import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Sức Khoẻ | Healthcare Therapy Center",
  description:
    "Cập nhật những kiến thức hữu ích về sức khoẻ, phương pháp điều trị và lối sống lành mạnh từ Healthcare Therapy Center.",
};

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      slug: "chiro-therapy-trong-dieu-tri-cac-van-de-ve-cot-song",
      title: "Chiro Therapy trong điều trị các vấn đề về cột sống",
      excerpt:
        "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại các yếu tố Âm - Dương bên trong cơ thể.",
      image: "/images/blog/blog-cover.jpg",
      date: "05/05/2023",
    },
    {
      id: 2,
      slug: "an-gi-va-uong-gi-de-khong-beo",
      title: "Chiro Therapy trong điều trị các vấn đề về cột sống",
      excerpt:
        "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại các yếu tố Âm - Dương bên trong cơ thể.",
      image: "/images/blog/related-blog-1.jpg",
      date: "28/04/2023",
    },
    {
      id: 3,
      slug: "lam-the-nao-de-dieu-tri-thoai-hoa-khop-goi",
      title: "Chiro Therapy trong điều trị các vấn đề về cột sống",
      excerpt:
        "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại các yếu tố Âm - Dương bên trong cơ thể.",
      image: "/images/blog/related-blog-2.jpg",
      date: "15/04/2023",
    },
    {
      id: 4,
      slug: "lam-the-nao-de-dieu-tri-thoai-hoa-khop-vai",
      title: "Chiro Therapy trong điều trị các vấn đề về cột sống",
      excerpt:
        "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại các yếu tố Âm - Dương bên trong cơ thể.",
      image: "/images/blog/related-blog-3.jpg",
      date: "05/04/2023",
    },
    {
      id: 5,
      slug: "chiro-therapy-trong-dieu-tri-cac-van-de-ve-cot-song-2",
      title: "Chiro Therapy trong điều trị các vấn đề về cột sống",
      excerpt:
        "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại các yếu tố Âm - Dương bên trong cơ thể.",
      image: "/images/blog/blog-cover.jpg",
      date: "05/05/2023",
    },
  ];

  // Featured trending posts (first 5 posts)
  const trendingPosts = blogPosts.slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] w-full mt-16 md:mt-20">
        <div className="absolute inset-0">
          <Image
            src="/images/blog/blog-hero.jpg"
            alt="Blog Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </section>

      {/* 2. Introduction */}
      <section className="py-16 text-center">
        <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-bold text-[#B1873F] mb-4">
          BLOG
        </h1>
      </section>

      {/* 3. Trending Topics */}
      <section className="container mx-auto px-4 mb-16 md:mb-20">
        <h2 className="text-2xl md:text-3xl font-medium mb-6 md:mb-8 text-[#222222]">
          Bài viết nổi bật
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {trendingPosts.map((post, index) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.id}
              className="group relative rounded-2xl overflow-hidden"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-medium text-base md:text-lg lg:text-xl">
                      {post.title}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Topic Listing */}
      <section className="container mx-auto px-4 mb-20">
        <h2 className="text-2xl md:text-3xl font-medium mb-8 text-[#222222]">
          Tất cả bài viết
        </h2>
        {blogPosts.map((post, index) => (
          <article key={post.id} className="mb-8">
            <div className="flex flex-col md:flex-row gap-8 border-b border-gray-300 pb-8">
              <div className="md:w-1/3">
                <Link
                  href={`/blog/${post.slug}`}
                  className="block relative rounded-2xl overflow-hidden h-60"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </Link>
              </div>
              <div className="md:w-2/3">
                <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-medium text-[#222222] mb-4 hover:text-[#B1873F] transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 line-clamp-5 mb-4">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-[#B1873F] font-medium hover:underline"
                >
                  Đọc thêm
                  <svg
                    className="ml-2 w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Pagination */}
      <section className="container mx-auto px-4 mb-16 flex justify-center">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center"
            aria-label="Previous page"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            className="w-10 h-10 rounded flex items-center justify-center border border-[#B1873F] bg-[#B1873F] text-white font-bold"
            aria-label="Page 1"
          >
            1
          </button>

          <button
            className="w-10 h-10 rounded flex items-center justify-center border border-gray-300 bg-white text-gray-600 font-bold"
            aria-label="Page 2"
          >
            2
          </button>

          <button
            className="w-10 h-10 rounded flex items-center justify-center border border-gray-300 bg-white text-gray-600 font-bold"
            aria-label="More pages"
          >
            ...
          </button>

          <button
            className="w-10 h-10 rounded flex items-center justify-center border border-gray-300 bg-white text-gray-600 font-bold"
            aria-label="Page 9"
          >
            9
          </button>

          <button
            className="w-10 h-10 rounded flex items-center justify-center border border-gray-300 bg-white text-gray-600 font-bold"
            aria-label="Page 10"
          >
            10
          </button>

          <button
            className="flex items-center justify-center"
            aria-label="Next page"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* 4. Newsletter */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1F1F1F] mb-6">
            Sẵn sàng trải nghiệm sự khác biệt
          </h2>
          <p className="text-lg md:text-xl text-black max-w-3xl mx-auto mb-8">
            Hãy để Healthcare Therapy Center trở thành điểm tựa vững chắc trong
            hành trình chăm sóc sức khỏe của bạn.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-[#B1873F] text-white rounded-full font-semibold hover:bg-[#c09857] transition-colors"
          >
            Đặt lịch trải nghiệm
            <svg
              className="ml-2 w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
