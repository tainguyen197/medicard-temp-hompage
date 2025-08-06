"use client";
import React, { useEffect, useState } from "react";
import HomeLoadingAnimation from "./HomeLoadingAnimation";

interface HomeLoadingWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function HomeLoadingWrapper({ children, isLoading = false }: HomeLoadingWrapperProps) {
  const [showLoading, setShowLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowLoading(false);
        // Add another delay before showing content for smooth fade-in
        setTimeout(() => {
          setShowContent(true);
        }, 300);
      }, 1000); // Minimum loading time of 1 second

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setTimeout(() => {
      setShowContent(true);
    }, 300);
  };

  return (
    <>
      {showLoading && <HomeLoadingAnimation onLoadingComplete={handleLoadingComplete} />}
      <div 
        className={`transition-opacity duration-500 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>
    </>
  );
} 