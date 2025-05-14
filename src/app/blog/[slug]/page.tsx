import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

type Params = Promise<{ slug: string }>;

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title:
      "Chiro Therapy trong điều trị các vấn đề về cột sống | Healthcare Therapy Center",
    description:
      "Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc. Khám phá phương pháp Chiro Therapy trong điều trị các vấn đề về cột sống tại Healthcare Therapy Center.",
  };
}

export default async function BlogDetailPage({ params }: { params: Params }) {
  // In a real app, you would fetch the blog post data based on the slug
  const { slug } = await params;

  return (
    <div className="pt-16 md:pt-24">
      {/* Hero Section with Cover Image */}
      <section className="relative w-full h-[40vh] md:h-[70vh]">
        <Image
          src="/images/blog/blog-cover.jpg"
          alt="Blog Cover"
          fill
          priority
          className="object-cover"
        />
      </section>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-2">
          <Link
            href="/blog"
            className="text-gray-500 hover:text-gray-700 text-sm md:text-base"
          >
            Blog
          </Link>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm md:text-base text-gray-900">
            Chiro Therapy trong điều trị các vấn đề về cột sống
          </span>
        </div>
      </div>

      {/* Title & Headline */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <h1 className="text-3xl md:text-5xl text-[#222222] font-semibold leading-tight mb-6">
          Chiro Therapy trong điều trị các vấn đề về cột sống
        </h1>
        <p className="text-xl md:text-2xl text-black font-semibold mb-10">
          Gìn giữ sức khoẻ cộng đồng bằng tinh hoa dân tộc
        </p>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 mb-16">
        <div className="mx-auto">
          <div className="prose prose-lg max-w-none">
            <p className="mb-8">
              Kể từ thời Văn Lang và Đại Việt, nền y học Việt Nam đã kết hợp lý
              luận y học từ phương Đông cùng với những kiến thức chữa bệnh tích
              góp từ 54 dân tộc khác nhau. Họ đã sử dụng đặc quyền am hiểu về
              các nguyên liệu thảo dược, dược liệu từ thiên nhiên của vùng nhiệt
              đới gió mùa và cuối cùng tích góp tạo ra nền y học cổ truyền của
              Việt Nam.
            </p>

            <p className="mb-8">
              Điểm tạo nên sự đặc biệt của phương pháp này chính là những vị
              thuốc có nguồn gốc từ thiên nhiên và được điều chỉnh linh hoạt
              theo từng ca bệnh khác nhau. Các phương pháp điều trị khác của y
              học cổ truyền như châm cứu, xoa bóp, bấm huyệt,... với mục tiêu
              chính là tập trung vào điều chỉnh và cân bằng lại các yếu tố Âm -
              Dương bên trong cơ thể cũng đã được ghi nhận về tính hiệu quả và
              an toàn
            </p>

            <h3 className="text-xl font-bold mt-10 mb-4">Châm cứu:</h3>
            <p className="mb-8">
              Các bác sĩ sẽ sử dụng các chiếc kim bằng kim loại nhỏ để châm
              xuyên qua lớp da, sau đó chuyển động bằng tay hoặc sử dụng biện
              pháp kích điện để tác động đến hệ thần kinh trung ương. Cơ chế này
              giúp giải phóng các chất hóa học vào trong cơ, tủy sống hay não và
              thúc đẩy khả năng tự chữa bệnh một cách tự nhiên của cơ thể.
            </p>

            <div className="my-10 h-full md:max-h-[500px] relative aspect-3/2 m-auto">
              <Image
                src="/images/blog/blog-image-2.jpg"
                alt="Châm cứu"
                fill
                className="rounded-lg w-full h-auto"
              />
            </div>

            <h3 className="text-xl font-bold mt-10 mb-4">Thuốc thang:</h3>
            <p className="mb-8">
              Thuốc ngành y học cổ truyền đều có thành phần từ nguyên liệu của
              thiên nhiên bao gồm cả thực vật và động vật. Mỗi vị thuốc sẽ được
              kết hợp với các dược liệu khác nhau tùy theo chứng bệnh. Đặc trưng
              của thuốc y học cổ truyền đó là có thể sử dụng được trong thời
              gian dài, phù hợp trong việc chữa trị các căn bệnh mãn tính.
            </p>

            <div className="my-10 h-full md:max-h-[500px] relative aspect-3/2 m-auto">
              <Image
                src="/images/blog/blog-hero.jpg"
                alt="Thuốc thang"
                fill
                className="rounded-lg w-full h-auto"
              />
            </div>

            <h3 className="text-xl font-bold mt-10 mb-4">
              Xoa bóp, bấm huyệt:
            </h3>
            <p className="mb-8">
              Đây không những là một phương pháp chữa trị các căn bệnh mãn tính
              mà còn giúp cho việc phòng bệnh rất hiệu quả. Cách thức hoạt động
              chính là sử dụng bàn tay và ngón tay để tác động lực lên các huyệt
              trên cơ thể bệnh nhân.
            </p>

            <div className="my-10 h-full md:max-h-[500px] relative aspect-3/2 m-auto">
              <Image
                src="/images/blog/blog-image-1.jpg"
                alt="Xoa bóp, bấm huyệt"
                fill
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
          <hr className="my-12 border-gray-300" />
        </div>
      </div>

      {/* Related Posts */}
      <div className="container mx-auto md:px-20 md:py-14 bg-[#FEF6EA] rounded-4xl">
        <div className="mx-auto px-4">
          <h2 className="text-3xl font-semibold text-[#222222] mb-10">
            Có thể bạn quan tâm
          </h2>
          <div className="space-y-6">
            {/* Related Post 1 */}
            <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-200">
              <div className="rounded-lg overflow-hidden">
                <div className="relative ounded-lg overflow-hidden aspect-1/1 h-[200px]">
                  <Image
                    src="/images/blog/related-blog-1.jpg"
                    alt="Related post"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="md:w-3/4 my-auto">
                <h3 className="text-xl md:text-2xl font-medium text-[#222222] hover:text-[#B1873F] transition-colors">
                  <Link href="/blog/an-gi-va-uong-gi-de-khong-beo">
                    Ăn gì và uống gì để không béo? Cách ăn uống cân bằng, khoa
                    học để giữ dáng hiệu quả
                  </Link>
                </h3>
              </div>
            </div>

            {/* Related Post 2 */}
            <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-200">
              <div className="rounded-lg overflow-hidden">
                <div className="relative rounded-lg overflow-hidden aspect-square h-[200px]">
                  <Image
                    src="/images/blog/related-blog-2.jpg"
                    alt="Related post"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="md:w-3/4 my-auto">
                <h3 className="text-xl md:text-2xl font-medium text-[#222222] hover:text-[#B1873F] transition-colors">
                  <Link href="/blog/lam-the-nao-de-dieu-tri-thoai-hoa-khop-goi">
                    Làm thế nào để điều trị thoái hoá khớp gối an toàn, hiệu
                    quả?
                  </Link>
                </h3>
              </div>
            </div>

            {/* Related Post 3 */}
            <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-200">
              <div className="rounded-lg overflow-hidden">
                <div className="relative rounded-lg overflow-hidden aspect-square h-[200px]">
                  <Image
                    src="/images/blog/related-blog-3.jpg"
                    alt="Related post"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="md:w-3/4 my-auto">
                <h3 className="text-xl md:text-2xl font-medium text-[#222222] hover:text-[#B1873F] transition-colors">
                  <Link href="/blog/lam-the-nao-de-dieu-tri-thoai-hoa-khop-vai">
                    Làm thế nào để điều trị thoái hoá khớp vai an toàn, hiệu
                    quả?
                  </Link>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#1F1F1F] mb-6">
            Sẵn sàng trải nghiệm sự khác biệt
          </h2>
          <p className="text-lg md:text-2xl text-black mb-10 max-w-3xl mx-auto">
            Hãy để Healthcare Therapy Center trở thành điểm tựa vững chắc trong
            hành trình chăm sóc sức khỏe của bạn.
          </p>
          <a
            href="tel:0901430077"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#B1873F] text-white rounded-full text-base md:text-lg font-semibold transition-all hover:bg-[#9A7435]"
          >
            Đặt lịch trải nghiệm
            <svg
              className="ml-2 w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
