declare module 'react-slick' {
  import React from 'react';
  
  export interface Settings {
    accessibility?: boolean;
    adaptiveHeight?: boolean;
    afterChange?: (currentSlide: number) => void;
    appendDots?: (dots: React.ReactNode) => React.ReactNode;
    arrows?: boolean;
    asNavFor?: Slider;
    autoplay?: boolean;
    autoplaySpeed?: number;
    beforeChange?: (currentSlide: number, nextSlide: number) => void;
    centerMode?: boolean;
    centerPadding?: string;
    className?: string;
    cssEase?: string;
    customPaging?: (i: number) => React.ReactNode;
    dots?: boolean;
    dotsClass?: string;
    draggable?: boolean;
    easing?: string;
    edgeFriction?: number;
    fade?: boolean;
    focusOnSelect?: boolean;
    infinite?: boolean;
    initialSlide?: number;
    lazyLoad?: 'ondemand' | 'progressive';
    nextArrow?: React.ReactNode;
    onEdge?: (swipeDirection: 'left' | 'right') => void;
    onInit?: () => void;
    onLazyLoad?: (slidesToLoad: number[]) => void;
    onReInit?: () => void;
    onSwipe?: (swipeDirection: 'left' | 'right') => void;
    pauseOnDotsHover?: boolean;
    pauseOnFocus?: boolean;
    pauseOnHover?: boolean;
    prevArrow?: React.ReactNode;
    responsive?: Array<{
      breakpoint: number;
      settings: 'unslick' | Settings;
    }>;
    rows?: number;
    rtl?: boolean;
    slide?: string;
    slidesPerRow?: number;
    slidesToScroll?: number;
    slidesToShow?: number;
    speed?: number;
    swipe?: boolean;
    swipeEvent?: (swipeDirection: 'left' | 'right') => void;
    swipeToSlide?: boolean;
    touchMove?: boolean;
    touchThreshold?: number;
    useCSS?: boolean;
    useTransform?: boolean;
    variableWidth?: boolean;
    vertical?: boolean;
    verticalSwiping?: boolean;
    waitForAnimate?: boolean;
    children?: React.ReactNode;
  }

  export default class Slider extends React.Component<Settings> {
    slickGoTo: (slideNumber: number, dontAnimate?: boolean) => void;
    slickNext: () => void;
    slickPause: () => void;
    slickPlay: () => void;
    slickPrev: () => void;
    slickGoTo: (index: number) => void;
  }
} 