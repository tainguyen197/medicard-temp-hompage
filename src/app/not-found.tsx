import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-16">
      <div className="relative flex items-center justify-center w-full max-w-lg mx-auto mb-8 mt-10">
        <div className="text-center">
          <h1 className="text-[180px] font-bold tracking-wider bg-gradient-to-b from-[#E7C68F] to-[#8B5A00] bg-clip-text text-transparent">
            404
          </h1>
        </div>
      </div>
      <div className="relative w-full flex justify-start h-[64px] items-center mr-[15%]">
        <Image
          src="/images/break_line.png"
          alt="Not Found"
          fill
          className="object-contain object-left h-full w-2/3"
        />
      </div>
      <div className="text-center mb-8 mt-10 max-w-lg mx-auto">
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          Rất tiếc, không tìm thấy nội dung
        </h2>
        <p className="text-gray-600">
          Vui lòng quay trở lại trang chủ hoặc liên hệ qua Hotline 0901 430 077
          để được hỗ trợ
        </p>
      </div>

      <Link href="/" className="max-w-lg w-full text-center mx-auto">
        <div className="bg-[#B1873F]  text-white py-3 px-8 rounded-full hover:bg-[#9A7535] transition-colors duration-300 font-medium">
          Trở về Trang chủ
        </div>
      </Link>
    </div>
  );
}
