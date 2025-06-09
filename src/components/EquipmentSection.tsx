"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
// Import Slick components
import Slider, { Settings } from "react-slick";
// Assuming slick-carousel CSS is imported globally as per TeamSection.tsx
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

interface EquipmentSectionProps {
  t: {
    title: string;
    subtitle: string;
    items: Array<{
      name: string;
      description: string;
      image: string;
    }>;
  };
}

interface EquipmentItemType {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

interface EquipmentItemProps extends EquipmentItemType {
  onTap: () => void;
  showInfo: boolean;
}

const EquipmentItem: React.FC<EquipmentItemProps> = ({
  id,
  image,
  title,
  subtitle,
  description,
  onTap,
  showInfo,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleItemMouseEnter = () => {
    if (hasMounted && !isMobileView) {
      setIsHovered(true);
    }
  };

  const handleItemMouseLeave = () => {
    if (hasMounted && !isMobileView) {
      setIsHovered(false);
    }
  };

  const handleClick = () => {
    if (hasMounted && isMobileView) {
      onTap();
    }
  };

  return (
    <div
      id={id}
      className={`transition-all duration-700 ease-in-out flex-shrink-0 w-full px-2 md:px-3 flex items-center justify-center`} // Added padding for spacing between items
      onMouseEnter={handleItemMouseEnter}
      onMouseLeave={handleItemMouseLeave}
      onClick={handleClick}
    >
      <div className="relative h-[300px] lg:h-[400px] xl:h-[520px] aspect-[537/604] overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={subtitle}
          fill
          className={`rounded-2xl overflow-hidden object-cover transition-opacity duration-300 ${
            (isHovered || showInfo) && hasMounted ? "opacity-30" : "opacity-100"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" // Added sizes for optimization
        />

        {hasMounted && (isHovered || showInfo) && (
          <div className="absolute inset-0 bg-black opacity-70 flex flex-col justify-center p-4 sm:p-6 md:p-8 text-white transition-all duration-300">
            <div className="text-[#A8C1E0] text-sm uppercase mb-1">{title}</div>
            <h3 className="text-xl sm:text-2xl font-bold uppercase mb-3 sm:mb-6">
              {subtitle}
            </h3>
            <p className="text-xs sm:text-sm md:text-md leading-relaxed text-justify">
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Removed PrevArrow and NextArrow components

const EquipmentSection = ({ t }: EquipmentSectionProps) => {
  const equipmentsData: EquipmentItemType[] = t.items.map((item, index) => ({
    id: `equip${index + 1}`,
    image: item.image,
    title: "EQUIPMENT",
    subtitle: item.name,
    description: item.description,
  }));

  const [infoVisibility, setInfoVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const sliderRef = useRef<Slider | null>(null);
  const [isSliderPausedByTap, setIsSliderPausedByTap] = useState(false);
  const [currentSlidesToShow, setCurrentSlidesToShow] = useState(2);
  const [isClient, setIsClient] = useState(false);
  const [currentSlickSlide, setCurrentSlickSlide] = useState(0);
  const [prevButtonActive, setPrevButtonActive] = useState(false);
  const [nextButtonActive, setNextButtonActive] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateSlidesToShowBasedOnWindowSize = () => {
      if (window.innerWidth < 768) {
        setCurrentSlidesToShow(1);
      } else {
        setCurrentSlidesToShow(2);
      }
    };
    updateSlidesToShowBasedOnWindowSize();
    window.addEventListener("resize", updateSlidesToShowBasedOnWindowSize);
    return () =>
      window.removeEventListener("resize", updateSlidesToShowBasedOnWindowSize);
  }, []);

  const numEquipments = equipmentsData.length;

  const finalEffectiveSettings = useMemo(() => {
    const settingsCalc: Settings = {
      dots: false,
      infinite: numEquipments > currentSlidesToShow,
      speed: 700,
      slidesToShow: currentSlidesToShow,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      pauseOnHover: true,
      arrows: false,
      cssEase: "ease-in-out",
      afterChange: (current) => setCurrentSlickSlide(current),
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(2, numEquipments),
            slidesToScroll: 1,
            infinite: numEquipments > Math.min(2, numEquipments),
            arrows: false,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: Math.min(1, numEquipments),
            slidesToScroll: 1,
            infinite: numEquipments > Math.min(1, numEquipments),
            arrows: false,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: numEquipments > 1,
            arrows: false,
          },
        },
      ],
    };

    // Ensure responsive settings also have arrows: false
    if (settingsCalc.responsive) {
      settingsCalc.responsive = settingsCalc.responsive.map((resp) => ({
        ...resp,
        settings: {
          ...(typeof resp.settings === "object" && resp.settings !== null
            ? resp.settings
            : {}),
          arrows: false,
        },
      }));
    }
    return settingsCalc;
  }, [numEquipments, currentSlidesToShow, isClient]);

  useEffect(() => {
    const anyInfoVisible = Object.values(infoVisibility).some((value) => value);
    if (!anyInfoVisible && isSliderPausedByTap) {
      console.log(
        "useEffect: All info cards hidden, slider was paused by tap. Resuming play."
      );
      if (finalEffectiveSettings.autoplay) {
        sliderRef.current?.slickPlay();
      }
      setIsSliderPausedByTap(false);
    }
  }, [infoVisibility, isSliderPausedByTap, finalEffectiveSettings.autoplay]);

  const handleTap = (id: string) => {
    const willBeVisible = !infoVisibility[id];
    console.log(
      `handleTap: Item ID '${id}'. Current visibility: ${!!infoVisibility[
        id
      ]}. Will be visible: ${willBeVisible}.`
    );

    setInfoVisibility((prev) => {
      const newState = { ...prev, [id]: willBeVisible };
      console.log(
        `handleTap: Queuing setInfoVisibility. Previous state for ID '${id}': ${!!prev[
          id
        ]}. New state for ID '${id}': ${newState[id]}. Full new state:`,
        newState
      );
      return newState;
    });

    if (willBeVisible) {
      console.log(
        `handleTap: Item ID '${id}' is being shown. Pausing slider and setting isSliderPausedByTap to true.`
      );
      sliderRef.current?.slickPause();
      setIsSliderPausedByTap(true);
    } else {
      console.log(
        `handleTap: Item ID '${id}' is being hidden. useEffect will check if slider needs to resume.`
      );
    }
  };

  const handleExternalPrev = () => {
    sliderRef.current?.slickPrev();
    setPrevButtonActive(true);
    setTimeout(() => setPrevButtonActive(false), 300);
  };

  const handleExternalNext = () => {
    sliderRef.current?.slickNext();
    setNextButtonActive(true);
    setTimeout(() => setNextButtonActive(false), 300);
  };

  if (!isClient) {
    return (
      <section className="py-10 md:py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4 xl:px-16 2xl:px-32 max-w-7xl">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-xl md:text-5xl font-cormorant font-bold text-gray-900 uppercase mb-4">
              {t.title}
            </h2>
            <p className="text-xs md:text-xl text-gray-700">{t.subtitle}</p>
          </div>
          <div className="text-center py-8 text-gray-500">
            Loading equipment...
          </div>
        </div>
      </section>
    );
  }

  if (numEquipments === 0) {
    return (
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-5xl font-cormorant font-bold text-gray-900 uppercase mb-4">
            {t.title}
          </h2>
          <p className="text-xs md:text-xl text-gray-700 mb-8">{t.subtitle}</p>
          <div className="py-8 text-gray-500">
            Equipment information is being updated.
          </div>
        </div>
      </section>
    );
  }

  const isPrevDisabled =
    !finalEffectiveSettings.infinite && currentSlickSlide === 0;
  // Ensure slidesToShow is positive for calculation, or rely on the fact that buttons won't render if numEquipments is 0 or 1 (unless infinite)
  const effectiveSlidesToShow = finalEffectiveSettings.slidesToShow || 1; // Treat undefined/0 as 1 for safety in calc
  const isNextDisabled =
    !finalEffectiveSettings.infinite &&
    currentSlickSlide >= numEquipments - effectiveSlidesToShow;

  return (
    <section className="py-10 md:py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 xl:px-16 2xl:px-32 max-w-7xl">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-xl md:text-5xl font-cormorant font-bold text-gray-900 uppercase mb-4">
            {t.title}
          </h2>
          <p className="text-xs md:text-xl text-gray-700">{t.subtitle}</p>
        </div>

        <div className="relative equipment-slider-container">
          <Slider ref={sliderRef} {...finalEffectiveSettings}>
            {equipmentsData.map((equip) => (
              <EquipmentItem
                key={equip.id}
                {...equip}
                onTap={() => handleTap(equip.id)}
                showInfo={!!infoVisibility[equip.id]}
              />
            ))}
          </Slider>
        </div>

        {numEquipments > 0 &&
          (finalEffectiveSettings.infinite ||
            numEquipments > (finalEffectiveSettings.slidesToShow || 0)) && (
            <div className="flex justify-center mt-10 space-x-4">
              <div className="grid grid-cols-2 gap-2 items-center">
                <button
                  onClick={handleExternalPrev}
                  className={`h-9 w-9 flex items-center justify-center border-[1.5px] text-[#002447] border-[#99D3ED] p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    prevButtonActive
                      ? "bg-[#99D3ED] text-white transform scale-110"
                      : ""
                  }`}
                  aria-label="Previous equipment"
                  disabled={isPrevDisabled}
                >
                  &lt;
                </button>
                <button
                  onClick={handleExternalNext}
                  className={`h-9 w-9 flex items-center justify-center border-[1.5px] text-[#002447] border-[#99D3ED] p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    nextButtonActive
                      ? "bg-[#99D3ED] text-white transform scale-110"
                      : ""
                  }`}
                  aria-label="Next equipment"
                  disabled={isNextDisabled}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
      </div>
      <style jsx global>{`
        .equipment-slider-container .slick-list {
          overflow: hidden; /* Ensure edges are clipped */
        }
        .equipment-slider-container .slick-slide > div {
          display: flex;
          height: 100%;
          align-items: stretch;
        }
        .equipment-slider-container .slick-slide > div > div {
          width: 100%;
          display: flex;
        }
        .slick-dots {
          display: none !important;
        }
        /* Removed specific .slick-prev and .slick-next styles as arrows are now external */
      `}</style>
    </section>
  );
};

export default EquipmentSection;
