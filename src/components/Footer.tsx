import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#182134] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Logo and company info */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="mb-6">
              <Image
                src="/images/logo.svg"
                alt="Healthcare Therapy Center"
                width={220}
                height={60}
                className="h-auto"
              />
            </div>
            <div className="text-gray-300 mb-4">
              <p className="mb-2">327 đường Nguyễn Trọng Tuyển, Phường 10,</p>
              <p className="mb-2">Quận Phú Nhuận, TP.HCM</p>
              <p>Giờ mở cửa: 9:00 - 20:00</p>
            </div>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xl font-medium mb-6">Công ty</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#B1873F] transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#B1873F] transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-[#B1873F] transition-colors"
                >
                  Blog Sức khoẻ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services links */}
          <div>
            <h4 className="text-xl font-medium mb-6">Dịch vụ</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/services/ortho"
                  className="hover:text-[#B1873F] transition-colors"
                >
                  Khám Cơ - Xương - Khớp
                </Link>
              </li>
              <li>
                <Link
                  href="/services/rehab"
                  className="hover:text-[#B1873F] transition-colors"
                >
                  Phục hồi chức năng
                </Link>
              </li>
              <li>
                <Link
                  href="/services/derma"
                  className="hover:text-[#B1873F] transition-colors"
                >
                  Chăm sóc da & Thẩm mỹ
                </Link>
              </li>
            </ul>
          </div>

          {/* Hotline and social */}
          <div className="md:col-span-3 lg:col-span-1">
            <h4 className="text-xl font-medium mb-6">HOTLINE</h4>
            <div className="mb-6">
              <Link
                href="tel:0901430077"
                className="inline-flex items-center px-6 py-3 border border-[#B1873F] hover:bg-[#B1873F]/10 transition-colors rounded-full text-[#B1873F] font-bold"
              >
                0901 430 077
                <svg className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="bg-blue-700 hover:bg-blue-800 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                </svg>
              </a>
              <a
                href="https://zalo.me"
                className="font-bold bg-blue-500 hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                aria-label="Zalo"
              >
                Zalo
              </a>
              <a
                href="https://instagram.com"
                className="bg-gradient-to-tr from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Copyright and links */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div>
            <p>Bản quyền © 2025 Healthcare Therapy Center</p>
          </div>
          <div className="flex mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-white mr-6">
              Điều khoản
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Chính sách
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
