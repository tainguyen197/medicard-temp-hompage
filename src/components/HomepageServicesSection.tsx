import Image from "next/image";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  shortDescription?: string;
  shortDescriptionEn?: string;
  featureImage?: {
    id: string;
    url: string;
    fileName?: string;
    originalName?: string;
  } | null;
  featureImageEn?: {
    id: string;
    url: string;
    fileName?: string;
    originalName?: string;
  } | null;
  createdAt: string;
}

interface HomepageServicesSectionProps {
  services: Service[];
  locale?: string;
}

export default function HomepageServicesSection({
  services,
  locale = "vi",
}: HomepageServicesSectionProps) {
  if (!services || services.length === 0) {
    return null;
  }

  const getLocalizedContent = (service: Service) => {
    const isEnglish = locale === "en";
    return {
      title: isEnglish && service.titleEn ? service.titleEn : service.title,
      shortDescription:
        isEnglish && service.shortDescriptionEn
          ? service.shortDescriptionEn
          : service.shortDescription,
      image:
        isEnglish && service.featureImageEn
          ? service.featureImageEn
          : service.featureImage,
    };
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {locale === "en" ? "Our Services" : "Dịch Vụ Của Chúng Tôi"}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {locale === "en"
              ? "Discover our comprehensive healthcare services designed to meet your needs with professional care and modern technology."
              : "Khám phá các dịch vụ chăm sóc sức khỏe toàn diện của chúng tôi, được thiết kế để đáp ứng nhu cầu của bạn với sự chăm sóc chuyên nghiệp và công nghệ hiện đại."}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => {
            const localizedContent = getLocalizedContent(service);
            return (
              <article
                key={service.id}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <Link href={`/services/${service.slug}`} className="block">
                  {/* Service Image */}
                  <div className="relative w-full aspect-[270/200] mb-4 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    {localizedContent.image ? (
                      <Image
                        src={localizedContent.image.url}
                        alt={localizedContent.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                        <div className="text-blue-400">
                          <svg
                            className="w-16 h-16"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Service Content */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {localizedContent.title}
                    </h3>

                    {localizedContent.shortDescription && (
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {localizedContent.shortDescription}
                      </p>
                    )}

                    <div className="pt-2">
                      <span className="inline-flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-200">
                        {locale === "en" ? "Learn More" : "Tìm Hiểu Thêm"}
                        <svg
                          className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* View All Services Button */}
        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {locale === "en" ? "View All Services" : "Xem Tất Cả Dịch Vụ"}
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
