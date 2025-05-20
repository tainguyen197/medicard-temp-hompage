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
      image: "/images/blog/related-blog-1.jpg",
    },
    {
      id: 2,
      slug: "an-gi-va-uong-gi-de-khong-beo",
      title: "Chiro Therapy trong điều trị các vấn đề về cột sống",
      excerpt:
        "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại các yếu tố Âm - Dương bên trong cơ thể.",
      image: "/images/blog/related-blog-1.jpg",
    },
    {
      id: 3,
      slug: "lam-the-nao-de-dieu-tri-thoai-hoa-khop-goi",
      title: "Chiro Therapy trong điều trị các vấn đề về cột sống",
      excerpt:
        "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại các yếu tố Âm - Dương bên trong cơ thể.",
      image: "/images/blog/related-blog-2.jpg",
    },
    {
      id: 4,
      slug: "lam-the-nao-de-dieu-tri-thoai-hoa-khop-vai",
      title: "Chiro Therapy trong điều trị các vấn đề về cột sống",
      excerpt:
        "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại các yếu tố Âm - Dương bên trong cơ thể.",
      image: "/images/blog/related-blog-3.jpg",
    },
    {
      id: 5,
      slug: "chiro-therapy-trong-dieu-tri-cac-van-de-ve-cot-song-2",
      title: "Chiro Therapy trong điều trị các vấn đề về cột sống",
      excerpt:
        "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc: Những vị thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt theo từng ca bệnh khác nhau, phối hợp với các phương pháp điều trị khác của y học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu chính là tập trung vào điều chỉnh và cân bằng lại các yếu tố Âm - Dương bên trong cơ thể.",
      image: "/images/blog/related-blog-3.jpg",
    },
  ];

  // Featured trending posts (first 5 posts)
  const trendingPosts = blogPosts.slice(0, 5);

  return (
    <div className="min-h-screen pt-[72px] md:pt-[96px]">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-section.png"
            alt="Blog Hero"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* 2. Introduction */}
      <section className="py-16 text-center">
        <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-bold text-[#B1873F] mb-4">
          BLOG
        </h1>
      </section>

      {/* 3. Trending Topics */}
      <section className="container mx-auto px-4 mb-16 md:mb-20 max-w-[1040px]">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Featured post (larger) - left side */}
          <div className="md:w-1/2">
            <Link
              href={`/blog/${trendingPosts[0].slug}`}
              className="group relative rounded-lg overflow-hidden block h-full"
            >
              <div className="aspect-auto h-full relative">
                <Image
                  src={trendingPosts[0].image}
                  alt={trendingPosts[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0">
                  <div className="absolute bottom-0 w-full p-4 md:p-8 bg-[#00000080]">
                    <h3 className="text-white font-medium text-xl md:text-2xl">
                      {trendingPosts[0].title}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Grid of smaller posts - right side */}
          <div className="md:w-1/2">
            <div className="grid grid-cols-2 gap-4 h-full">
              {trendingPosts.slice(1, 5).map((post) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.id}
                  className="group relative rounded-lg overflow-hidden"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0">
                      <div className="absolute bottom-0 p-4 bg-[#00000080]">
                        <h3 className="text-white font-medium text-sm md:text-base">
                          {post.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Topic Listing */}
      <section className="container mx-auto px-4 max-w-[1040px]">
        <h2 className="text-2xl md:text-3xl font-medium mb-8 text-[#222222] hidden">
          Tất cả bài viết
        </h2>
        {blogPosts.map((post, index) => (
          <article key={post.id}>
            <div className="flex flex-col md:flex-row items-center mb-4 md:mb-12">
              <div className="pr-8 flex flex-col">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-medium text-[#222222] mb-4 hover:text-[#B1873F] transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="block relative rounded-xl overflow-hidden aspect-square md:h-44"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </Link>
              </div>
            </div>
            <div className="flex justify-center w-full">
              <div className="w-full mx-10 md:mx-30 border-b border-[#0000004D] mb-8"></div>
            </div>
          </article>
        ))}
      </section>

      {/* Pagination */}
      <section className="container mx-auto px-4 mb-0 flex justify-start max-w-[1040px]">
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
            className="w-10 h-10 rounded flex items-center justify-center border border-[#B1873F] text-[#B1873F] font-bold"
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
      <section className="py-16 bg-white max-w-[1040px] mx-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl max-text-[51px] font-semibold text-[#1F1F1F] mb-6">
            Sẵn sàng trải nghiệm sự khác biệt
          </h2>
          <p className="text-lg md:text-xl px-16 text-black max-w-3xl mx-auto mb-8">
            Hãy để Healthcare Therapy Center trở thành điểm tựa vững chắc trong
            hành trình chăm sóc sức khỏe của bạn.
          </p>
          <Link
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
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
