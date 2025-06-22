"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { fetchTeamMembers } from "@/lib/api";
import {
  defaultTeamMembers,
  getLocalizedTeamMember,
  getActiveTeamMembers,
  TeamMemberData,
} from "@/data/team";
// Import Slick components
import Slider, { Settings } from "react-slick";
// CSS is already imported in the layout.tsx file

interface TeamMember {
  image: string;
  description: string;
  name: string;
  title: string;
}

interface TeamMemberProps {
  image: string;
  description: string;
  name: string;
  title: string;
  index: number;
  dynamicCardWidth?: string;
}

// Define types for arrow props
interface ArrowProps {
  onClick?: () => void;
  className?: string;
}

// Database team member type (from API)
interface ApiTeamMember {
  id: string;
  name: string;
  nameEn?: string | null;
  title: string;
  titleEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  order: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  image?: {
    id: string;
    url: string;
    fileName?: string | null;
    originalName?: string | null;
  } | null;
  imageEn?: {
    id: string;
    url: string;
    fileName?: string | null;
    originalName?: string | null;
  } | null;
}

// Function to get localized content from API team member
const getLocalizedApiTeamMember = (member: ApiTeamMember, locale: string) => {
  return {
    name: locale === "en" && member.nameEn ? member.nameEn : member.name,
    title: locale === "en" && member.titleEn ? member.titleEn : member.title,
    description:
      locale === "en" && member.descriptionEn
        ? member.descriptionEn
        : member.description,
  };
};

// Convert API team member to UI team member format
const convertApiTeamMemberToTeamMember = (
  apiMember: ApiTeamMember,
  locale: string
): TeamMember => {
  const localizedContent = getLocalizedApiTeamMember(apiMember, locale);

  return {
    name: localizedContent.name,
    title: localizedContent.title,
    description: localizedContent.description,
    image:
      apiMember.image?.url || apiMember.imageEn?.url || "/images/doctor1.jpg", // fallback image
  };
};

const TeamMember: React.FC<TeamMemberProps> = ({
  image,
  description,
  name,
  title,
  index,
  dynamicCardWidth,
}) => {
  const defaultWidthClasses =
    "sm:w-[230px] md:w-[230px] lg:w-[250px] xl:w-[280px]";
  const currentWidthClass = dynamicCardWidth || defaultWidthClasses;

  return (
    <div
      className={`flex-shrink-0 w-full ${currentWidthClass} overflow-hidden bg-white flex flex-col mb-8 ${
        index % 2 !== 0 ? "md:mt-20" : ""
      }`}
    >
      <div className="relative rounded-3xl md:rounded-t-4xl overflow-hidden">
        <div className="aspect-[3/4] relative">
          <Image
            src={image}
            alt={name}
            fill
            className="w-full h-full object-cover object-top transition-transform duration-500"
          />
        </div>
      </div>
      <div className="p-4 text-black text-center">
        <p className="text-sm text-justify leading-tight">{description}</p>
      </div>
    </div>
  );
};

const TeamSection: React.FC = () => {
  const locale = useLocale();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert TeamMemberData to TeamMember format for backward compatibility
  const convertTeamDataToTeamMember = (
    teamData: TeamMemberData
  ): TeamMember => {
    const localizedMember = getLocalizedTeamMember(teamData, locale);
    return {
      name: localizedMember.name,
      title: localizedMember.title,
      description: localizedMember.description,
      image: teamData.image,
    };
  };

  // Get fallback team members from our data file
  const fallbackTeamMembers: TeamMember[] = getActiveTeamMembers(
    defaultTeamMembers
  ).map(convertTeamDataToTeamMember);

  // Fetch team members from API
  useEffect(() => {
    async function loadTeamMembers() {
      try {
        setLoading(true);
        setError(null);

        const apiTeamMembers = await fetchTeamMembers();

        if (apiTeamMembers && apiTeamMembers.length > 0) {
          // Filter active members and sort by order
          const activeMembers = apiTeamMembers
            .filter((member) => member.status === "ACTIVE")
            .sort((a, b) => a.order - b.order);

          // Convert API team members to UI format
          const convertedMembers = activeMembers.map((member) =>
            convertApiTeamMemberToTeamMember(member, locale)
          );
          setTeamMembers(convertedMembers);
        } else {
          // Use fallback data if no team members found
          setTeamMembers(fallbackTeamMembers);
        }
      } catch (err) {
        console.error("Failed to fetch team members:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch team members"
        );
        // Use fallback data on error
        setTeamMembers(fallbackTeamMembers);
      } finally {
        setLoading(false);
      }
    }

    loadTeamMembers();
  }, [locale]);

  // Use fallback team members while loading or if no team members available
  const displayTeamMembers =
    teamMembers.length > 0 ? teamMembers : fallbackTeamMembers;

  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef<Slider | null>(null);

  const [currentSliderSettings, setCurrentSliderSettings] = useState<Settings>(
    {}
  );
  const [dynamicCardWidth, setDynamicCardWidth] = useState<string | undefined>(
    undefined
  );

  // Check for mobile viewport
  useEffect(() => {
    const checkDisplay = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
    };

    checkDisplay();
    window.addEventListener("resize", checkDisplay);
    return () => window.removeEventListener("resize", checkDisplay);
  }, []);

  // Custom arrow components
  const PrevArrow = (props: ArrowProps) => {
    const { onClick } = props;
    return (
      <button
        className="absolute left-1 top-[30%] z-10 bg-white rounded-full p-2 shadow-lg text-[#002447] hover:bg-gray-100 transition-colors border border-[#002447]/10"
        onClick={onClick}
        aria-label="Previous slide"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor">
          <path
            d="M15 19l-7-7 7-7"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  const NextArrow = (props: ArrowProps) => {
    const { onClick } = props;
    return (
      <button
        className="absolute right-1 top-[30%] z-10 bg-white rounded-full p-2 shadow-lg text-[#002447] hover:bg-gray-100 transition-colors border border-[#002447]/10"
        onClick={onClick}
        aria-label="Next slide"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor">
          <path
            d="M9 5l7 7-7 7"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  useEffect(() => {
    const getSettingsAndCardWidth = (): {
      settings: Settings;
      cardWidth: string | undefined;
    } => {
      const screenWidth = window.innerWidth;
      let cardWidth: string | undefined = undefined;
      const currentTeamSize = displayTeamMembers.length;

      const commonProps: Partial<Settings> = {
        dots: false,
        speed: 500,
        pauseOnHover: true,
      };

      if (screenWidth < 768) {
        // Explicit mobile handling
        return {
          settings: {
            ...commonProps,
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: "0px",
            infinite: currentTeamSize > 1,
            autoplay: currentTeamSize > 1,
            autoplaySpeed: 3000,
            arrows: currentTeamSize > 1,
            prevArrow: <PrevArrow />,
            nextArrow: <NextArrow />,
            draggable: currentTeamSize > 1,
            swipe: currentTeamSize > 1,
            touchMove: currentTeamSize > 1,
            responsive: [], // No further responsive needed
          },
          cardWidth: undefined,
        };
      } else if (
        // Static display for >= 768px and 1-4 items
        currentTeamSize > 0 &&
        currentTeamSize <= 4
      ) {
        // Static display: Calculate card width based on screenWidth and currentTeamSize
        if (screenWidth < 1024) {
          // 768px to 1023px (md breakpoint range)
          if (currentTeamSize === 4) cardWidth = "w-[150px]";
          else if (currentTeamSize === 3) cardWidth = "w-[200px]";
        } else if (screenWidth < 1280) {
          // 1024px to 1279px (lg breakpoint range)
          if (currentTeamSize === 4) cardWidth = "w-[210px]";
        }
        // For xl (>=1280px) or fewer items where defaults are fine, cardWidth remains undefined

        return {
          settings: {
            ...commonProps,
            slidesToShow: currentTeamSize,
            slidesToScroll: currentTeamSize,
            infinite: false,
            autoplay: false,
            arrows: false,
            draggable: false,
            swipe: false,
            touchMove: false,
            responsive: [],
          },
          cardWidth,
        };
      } else {
        // Slider for >= 768px and (currentTeamSize > 4 or currentTeamSize === 0)
        // Note: currentTeamSize === 0 is primarily handled by updateLayout initial settings
        const numSlidesBase =
          currentTeamSize > 0 ? Math.min(4, currentTeamSize) : 1;
        const canSlideBase = currentTeamSize > numSlidesBase;

        return {
          settings: {
            ...commonProps,
            infinite: currentTeamSize > 1,
            slidesToShow: numSlidesBase,
            slidesToScroll: 1,
            autoplay: currentTeamSize > 1,
            autoplaySpeed: 3000,
            arrows: canSlideBase,
            prevArrow: <PrevArrow />,
            nextArrow: <NextArrow />,
            draggable: currentTeamSize > 1,
            swipe: currentTeamSize > 1,
            touchMove: currentTeamSize > 1,
            responsive: [
              {
                breakpoint: 1280, // for screens < 1280px (i.e., 768px to 1279px)
                settings: {
                  slidesToShow: Math.min(3, currentTeamSize),
                  arrows: currentTeamSize > Math.min(3, currentTeamSize),
                },
              },
              {
                breakpoint: 1024, // for screens < 1024px (i.e., 768px to 1023px)
                settings: {
                  slidesToShow: Math.min(2, currentTeamSize),
                  arrows: currentTeamSize > Math.min(2, currentTeamSize),
                },
              },
            ],
          },
          cardWidth: undefined,
        };
      }
    };

    const updateLayout = () => {
      if (displayTeamMembers.length === 0) {
        setCurrentSliderSettings({
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          arrows: false,
          autoplay: false,
        });
        setDynamicCardWidth(undefined);
      } else {
        const { settings, cardWidth } = getSettingsAndCardWidth();
        setCurrentSliderSettings(settings);
        setDynamicCardWidth(cardWidth);
      }
    };

    updateLayout(); // Initial call

    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [displayTeamMembers.length]);

  return (
    <section className="pt-10 md:pt-16 md:pb-20 bg-white">
      <div className="mx-auto relative">
        <div className="relative mx-auto">
          {/* Title with horizontal lines on sides */}
          <div className="hidden lg:block border-[3px] border-[#002447] rounded-[40px] py-8 max-w-[1300px] absolute inset-0 -top-8 mx-32 2xl:mx-auto bottom-[-52px]" />
          <div>
            <div className="flex items-center justify-center relative md:top-[-54px]">
              <h2 className="font-cormorant text-xl md:text-5xl max-text-[51px] font-bold text-[#002447] uppercase whitespace-nowrap bg-white px-8">
                {locale === "en" ? "MEDICAL TEAM" : "ĐỘI NGŨ CHUYÊN GIA"}
              </h2>
            </div>

            {/* Team members section with React Slick */}
            <div className="pt-8 bg-white relative z-1">
              <div className="relative py-4 pb-0 bg-white z-1 px-4 md:px-10 max-w-[1300px] mx-auto">
                {/* Show error message if there was an error (but still show fallback data) */}
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">
                      {error} - Showing default team members.
                    </p>
                  </div>
                )}

                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002447]"></div>
                  </div>
                ) : displayTeamMembers.length > 0 ? (
                  <Slider
                    ref={sliderRef}
                    {...currentSliderSettings}
                    className="team-slider"
                  >
                    {displayTeamMembers.map((member, index) => (
                      <div key={index} className="px-2">
                        <TeamMember
                          {...member}
                          index={index}
                          dynamicCardWidth={dynamicCardWidth}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    {locale === "en"
                      ? "Our team of experts will be updated soon."
                      : "Đội ngũ chuyên gia sẽ sớm được cập nhật."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        /* Custom styling for the slider */
        .team-slider .slick-track {
          display: flex !important;
          align-items: flex-start;
        }

        .team-slider .slick-slide {
          height: auto;
          padding: 0 8px;
        }

        /* Fix height issues */
        .team-slider .slick-list {
          overflow: visible;
          padding: 0 !important;
        }

        /* Make sure alternating cards have the correct offset */
        .team-slider .slick-slide:nth-child(even) .md\\:mt-20 {
          margin-top: 5rem;
        }
      `}</style>
    </section>
  );
};

export default TeamSection;
