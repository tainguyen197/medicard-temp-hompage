import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function RehabPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative mt-16 md:mt-20">
        <div className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
          <Image
            src="/images/hero-bg.png"
            alt="Vật lý trị liệu công nghệ cao"
            className="object-cover object-center"
            priority
            fill
          />
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
        <div className="flex items-center text-lg">
          <Link href="/services" className="text-gray-500 hover:text-gray-700">
            Dịch vụ
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mx-2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-black">Vật lý trị liệu công nghệ cao</span>
        </div>
      </section>

      {/* Title Section */}
      <section className="container mx-auto px-4 pt-4 pb-10 md:pt-6 md:pb-16 max-w-7xl">
        <h1 className="text-3xl md:text-[42px] font-semibold text-[#222222] mb-6 leading-[140%]">
          ĐIỀU TRỊ VẬT LÝ TRỊ LIỆU CÔNG NGHỆ CAO
        </h1>
        <h2 className="text-md md:text-[20px] font-semibold text-black">
          Tối đa hóa khả năng điều trị, phục hồi với công nghệ tiên tiến
        </h2>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 pb-16 md:pb-24 max-w-7xl">
        <div className="space-y-12 md:space-y-16">
          {/* Introduction */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">
            <div className="order-2 md:order-1">
              <p className="text-md md:text-[16px] text-black leading-relaxed">
                Healthcare Therapy Center áp dụng những công nghệ vật lý trị
                liệu tiên tiến, hiện đại nhằm tối đa hóa khả năng điều trị, phục
                hồi của khách hàng.
              </p>
              <br />
              <p className="text-md md:text-[16px] text-black leading-relaxed">
                Các công nghệ Laser công suất cao, Sóng cao tần Radio Frequency
                (RF), Sóng xung kích Shockwave được chứng minh qua nhiều nghiên
                cứu khoa học trên thế giới là hiệu quả cao trong việc điều trị
                các bệnh lý cơ xương khớp, giảm đau, đẩy nhanh tốc độ tái tạo và
                phục hồi.
              </p>
            </div>
          </div>

          {/* Laser công suất cao */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">
            <div>
              <h3 className="text-md md:text-[18px] font-semibold mb-4">
                Laser công suất cao:
              </h3>
              <p className="text-md md:text-[16px] text-black leading-relaxed">
                Healthcare Therapy center sử dụng dòng máy Laser mới nhất hiện
                nay, công suất cao cung cấp năng lượng mạnh mẽ tác động đến cấp
                độ mô – tế bào ở sâu cần phục hồi, tái tạo.
              </p>
              <div className="order-1 md:order-2">
                <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto">
                  <Image
                    src="/images/VLTL 1.jpg"
                    alt="Radio Frequency"
                    className="object-contain rounded-lg"
                    fill
                  />
                </div>
              </div>
              <p className="text-md md:text-[16px] text-black leading-relaxed mt-4">
                <strong>
                  Tác dụng Laser công suất cao trong điều trị các bệnh lý cơ
                  xương khớp:
                </strong>
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-md md:text-[16px] text-black">
                <li>
                  <strong>Giảm đau:</strong> Giúp giảm đau nhanh chóng cho những
                  bệnh nhân bị đau cấp tính hoặc mãn tính, giúp lấy lại khả năng
                  vận động và cải thiện chất lượng cuộc sống.
                </li>
                <div className="order-1 md:order-2">
                  <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto">
                    <Image
                      src="/images/VLTL 2.jpg"
                      alt="Vật lý trị liệu công nghệ cao"
                      className="object-contain rounded-lg"
                      fill
                    />
                  </div>
                </div>
                <li>
                  <strong>Phục hồi cho tế bào nhanh hơn:</strong> Laser thúc đẩy
                  quá trình phục hồi tế bào nhanh hơn bằng cách kích thích tái
                  tạo tế bào ở cấp độ phân tử, đẩy nhanh quá trình phục hồi và
                  giảm thiểu thời gian nghỉ dưỡng.
                </li>
                <li>
                  <strong>Tăng cường lưu thông:</strong> Cải thiện lưu lượng máu
                  và oxy đến các vùng bị ảnh hưởng, tạo điều kiện cung cấp chất
                  dinh dưỡng và loại bỏ chất thải.
                </li>
              </ul>
              <p className="text-md md:text-[16px] text-black leading-relaxed mt-4">
                Tùy vào các bước sóng khác nhau: 810nm, 650nm, 915nm mà mang đến
                các tác dụng khác nhau, Laser được bác sĩ tinh chỉnh ứng dụng
                phù hợp với bệnh lý cơ xương khớp, tình trạng và đáp ứng của
                từng khách hàng.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto">
              <Image
                src="/images/VLTL 3.jpg"
                alt="Vật lý trị liệu công nghệ cao"
                className="object-contain rounded-lg"
                fill
              />
            </div>
          </div>
          {/* Radio Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">
            <div className="order-2 md:order-1">
              <h3 className="text-md md:text-[18px] font-semibold mb-4">
                Radio Frequency (Sóng RF):
              </h3>
              <p className="text-md md:text-[16px] text-black leading-relaxed">
                Phương pháp này sử dụng công nghệ sóng cao tần (RF) tạo ra năng
                lượng cao, thúc đẩy quá trình tái tạo cơ và khớp, kích thích cơ
                chế tự phục hồi tự nhiên của cơ thể con người.
              </p>
              <p className="text-md md:text-[16px] text-black leading-relaxed mt-2">
                Phương pháp trị liệu ứng dụng trong chấn thương cấp tính và bán
                cấp tính, bệnh lý cơ xương khớp mãn tính, phục hồi chức năng,
                kiểm soát cơn đau.
              </p>
              <div className="order-1 md:order-2">
                <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto">
                  <Image
                    src="/images/VLTL 4.jpg"
                    alt="Vật lý trị liệu công nghệ cao"
                    className="object-contain rounded-lg"
                    fill
                  />
                </div>
              </div>
              <p className="text-md md:text-[16px] text-black leading-relaxed mt-4">
                <strong>Tác dụng của sóng cao tần trong điều trị:</strong>
              </p>
              <div className="order-1 md:order-2">
                <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto">
                  <Image
                    src="/images/VLTL 5.jpg"
                    alt="Vật lý trị liệu công nghệ cao"
                    className="object-contain rounded-lg"
                    fill
                  />
                </div>
              </div>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-md md:text-[16px] text-black">
                <li>
                  <strong>Loại bỏ cơn đau:</strong> Năng lượng sóng RF ngăn chặn
                  các xung thần kinh liên quan đến cơn đau, giảm đau ngay lập
                  tức trong hơn 48 giờ.
                </li>
                <li>
                  <strong>Cải thiện biên độ vận động (nhanh hơn 6 lần):</strong>{" "}
                  Năng lượng sóng RF vào cơ thể chuyển thành năng lượng nhiệt
                  lớn. Sự gia tăng nhiệt cục bộ này buộc phải tái thông mạch các
                  vùng bị hạn chế và giải phóng biên vận động giới hạn.
                </li>
                <li>
                  <strong>Tăng tốc độ chữa lành (hiệu quả 97%):</strong> Năng
                  lượng thúc đẩy quá trình trao đổi bên trong và bên ngoài tế
                  bào, do đó giúp chữa lành mô nhanh hơn.
                </li>
              </ul>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto">
                <Image
                  src="/images/VLTL 6.jpg"
                  alt="Radio Frequency"
                  className="object-contain rounded-lg"
                  fill
                />
              </div>
            </div>
          </div>

          {/* Shockwave Therapy */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">
            <div>
              <h3 className="text-md md:text-[18px] font-semibold mb-4">
                Shockwave Therapy (Sóng xung kích):
              </h3>
              <p className="text-md md:text-[16px] text-black leading-relaxed">
                Sóng xung kích là một dạng sóng âm có năng lượng cao, được sử
                dụng rộng rãi trong y học, đặc biệt là trong lĩnh vực vật lý trị
                liệu và điều trị các bệnh lý về cơ xương khớp. Máy sóng xung
                kích tạo ra những xung điện năng lượng cao, chuyển đổi thành
                sóng âm có tần số và cường độ khác nhau.
              </p>
              <div className="order-1 md:order-2">
                <div className="relative w-full h-64 md:h-full min-h-[300px] max-w-2xl mx-auto">
                  <Image
                    src="/images/VLTL 7.jpg"
                    alt="Radio Frequency"
                    className="object-contain rounded-lg"
                    fill
                  />
                </div>
              </div>

              <p className="text-md md:text-[16px] text-black leading-relaxed mt-4">
                <strong>
                  Tác dụng của Shockwave Therapy trong điều trị các bệnh lý Cơ
                  xương khớp:
                </strong>
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-md md:text-[16px] text-black">
                <li>
                  <strong>Kích thích phục hồi:</strong> Sóng xung kích kích
                  thích quá trình chữa lành tự nhiên của cơ thể, thúc đẩy quá
                  trình tái tạo mô, giảm viêm và giảm đau.
                </li>
                <li>
                  <strong>Giảm đau:</strong> Sóng xung kích tác động lên các dây
                  thần kinh, ức chế tín hiệu đau và giảm cảm giác khó chịu.
                </li>
                <li>
                  <strong>Tăng cường tuần hoàn máu:</strong> Sóng xung kích kích
                  thích sự hình thành mạch máu mới, cải thiện lưu thông máu đến
                  vùng tổn thương, giúp các mô được cung cấp đầy đủ oxy và chất
                  dinh dưỡng để phục hồi.
                </li>
                <li>
                  <strong>Phân tán các cặn canxi:</strong> Sóng xung kích có khả
                  năng phá vỡ các cặn canxi lắng đọng tại các khớp, gân, giúp
                  giảm đau và cải thiện vận động.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#1F1F1F] mb-4 md:mb-6">
            Sẵn sàng trải nghiệm sự khác biệt
          </h2>
          <p className="text-lg md:text-2xl text-black mb-10 max-w-4xl mx-auto">
            Hãy để Healthcare Therapy Center trở thành điểm tựa vững chắc
            <br />
            trong hành trình chăm sóc sức khỏe của bạn.
          </p>
          <a
            href="https://forms.gle/GJETkvXcnZ7hZwBr8"
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#B1873F] text-white rounded-full text-base md:text-lg font-semibold transition-all hover:bg-[#9A7435]"
          >
            Đặt lịch trải nghiệm
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
