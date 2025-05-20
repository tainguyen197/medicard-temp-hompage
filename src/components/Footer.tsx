import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#182134] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Logo and company info */}
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-10 mb-10">
          <div className="col-span-3 lg:col-span-2">
            <div className="mb-2">
              <Image
                src="/images/logo.svg"
                alt="Healthcare Therapy Center"
                width={220}
                height={60}
                className="h-auto "
              />
            </div>
            <div className="text-white mb-4 font-bold">
              <p className="mb-2 text-sm md:text-md">
                327 đường Nguyễn Trọng Tuyển, Phường 10, Quận Phú Nhuận, TP.HCM
              </p>
              <p className="text-sm md:text-md">
                Giờ mở cửa: <br />
                Thứ 2 - Thứ 7: 8h00 - 19h00 <br />
                Chủ nhật: 8h00 - 18h00
              </p>
            </div>
          </div>

          {/* Company links */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-md md:text-xl font-bold md:font-medium mb-6">
              Công ty
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#B1873F] transition-colors text-sm md:text-md"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#B1873F] transition-colors text-sm md:text-md"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="hover:text-[#B1873F] transition-colors text-sm md:text-md"
                >
                  Tin tức
                </Link>
              </li>
            </ul>
          </div>

          {/* Services links */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-md md:text-xl font-bold md:font-medium mb-6">
              Dịch vụ
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/services/ortho"
                  className="hover:text-[#B1873F] transition-colors text-sm md:text-md"
                >
                  Y học cổ truyền
                </Link>
              </li>
              <li>
                <Link
                  href="/services/rehab"
                  className="hover:text-[#B1873F] transition-colors text-sm md:text-md"
                >
                  Vật lý trị liệu
                </Link>
              </li>
              <li>
                <Link
                  href="/services/derma"
                  className="hover:text-[#B1873F] transition-colors text-sm md:text-md"
                >
                  Phục hồi chức năng
                </Link>
              </li>
            </ul>
          </div>

          {/* Hotline and social */}
          <div className="col-span-3 md:col-span-1 flex items-center md:block">
            <h4 className="hidden md:block text-xl font-medium mb-4">
              HOTLINE
            </h4>
            <div className="md:mb-6">
              <Link
                href="tel:0901430077"
                className="inline-flex items-center px-1 py-2 md:px-6 md:py-3 border border-[#B1873F] hover:bg-[#B1873F]/10 transition-colors rounded-xl md:rounded-full text-[#B1873F] font-bold text-xs md:text-md"
              >
                0901 430 077
                <svg
                  className="ml-2 w-4 h-4 md:w-5 md:h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
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

            <div className="flex space-x-2 md:space-x-4 ml-4 md:ml-0">
              <a
                href="https://www.facebook.com/htcwellness/"
                className="rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
                target="_blank"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="32" height="32" rx="16" fill="#2B3D96" />
                  <path
                    d="M19.5 10.168H17.75C16.9765 10.168 16.2346 10.4753 15.6876 11.0222C15.1407 11.5692 14.8334 12.3111 14.8334 13.0846V14.8346H13.0834V17.168H14.8334V21.8346H17.1667V17.168H18.9167L19.5 14.8346H17.1667V13.0846C17.1667 12.9299 17.2282 12.7816 17.3376 12.6722C17.447 12.5628 17.5953 12.5013 17.75 12.5013H19.5V10.168Z"
                    fill="white"
                  />
                </svg>
              </a>
              <a
                href="https://zalo.me/0901430077"
                className="font-bold rounded-full flex items-center justify-center transition-colors"
                aria-label="Zalo"
                target="_blank"
              >
                <Image
                  src="/images/icon_zalo.svg"
                  alt="Zalo"
                  width={32}
                  height={32}
                />
              </a>
              <a
                href="https://www.instagram.com/healthcaretherapycenter/"
                className=" rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
                target="_blank"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="32" height="32" rx="16" fill="#2B3D96" />
                  <path
                    d="M18.9166 10.168H13.0833C11.4725 10.168 10.1666 11.4738 10.1666 13.0846V18.918C10.1666 20.5288 11.4725 21.8346 13.0833 21.8346H18.9166C20.5275 21.8346 21.8333 20.5288 21.8333 18.918V13.0846C21.8333 11.4738 20.5275 10.168 18.9166 10.168Z"
                    fill="white"
                  />
                  <path
                    d="M18.3333 15.6317C18.4053 16.1172 18.3224 16.613 18.0964 17.0486C17.8703 17.4843 17.5127 17.8375 17.0743 18.0582C16.6359 18.2788 16.1391 18.3556 15.6545 18.2777C15.17 18.1997 14.7224 17.9709 14.3753 17.6239C14.0283 17.2768 13.7995 16.8292 13.7215 16.3447C13.6436 15.8601 13.7204 15.3633 13.941 14.9249C14.1617 14.4865 14.5149 14.1289 14.9506 13.9028C15.3862 13.6768 15.882 13.5939 16.3675 13.6659C16.8627 13.7393 17.3212 13.9701 17.6751 14.324C18.0291 14.678 18.2599 15.1365 18.3333 15.6317Z"
                    stroke="#2B3D96"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.2084 12.793H19.2142"
                    stroke="#2B3D96"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#B1873F] my-8"></div>

        {/* Copyright and links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-gray-400">
          <div>
            <p>Bản quyền © 2025 Healthcare Therapy Center</p>
          </div>
          <div className="hidden md:flex mt-4 md:mt-0">
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
