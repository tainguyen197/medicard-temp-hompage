"use client";

import { useRef, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

interface AnimationVariants {
  hidden: React.CSSProperties;
  visible: React.CSSProperties;
}

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideLeft"
    | "slideRight"
    | "zoomIn"
    | "scale";
  delay?: number;
  duration?: number;
  threshold?: number;
}

const animations: Record<string, AnimationVariants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, transform: "translateY(50px)" },
    visible: { opacity: 1, transform: "translateY(0)" },
  },
  slideLeft: {
    hidden: { opacity: 0, transform: "translateX(-50px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  slideRight: {
    hidden: { opacity: 0, transform: "translateX(50px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  zoomIn: {
    hidden: { opacity: 0, transform: "scale(0.9)" },
    visible: { opacity: 1, transform: "scale(1)" },
  },
  scale: {
    hidden: { opacity: 0, transform: "scale(0.8)" },
    visible: { opacity: 1, transform: "scale(1)" },
  },
};

export default function AnimatedSection({
  children,
  className = "",
  animation = "fadeIn",
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold });

  const variant = animations[animation];

  const animationStyle = isInView
    ? {
        ...variant.visible,
        transition: `all ${duration}s ease-out ${delay}s`,
      }
    : {
        ...variant.hidden,
        transition: "none",
      };

  return (
    <div ref={ref} className={className} style={animationStyle}>
      {children}
    </div>
  );
}
