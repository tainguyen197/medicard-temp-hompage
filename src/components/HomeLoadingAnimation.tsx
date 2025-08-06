"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface HomeLoadingAnimationProps {
  onLoadingComplete?: () => void;
}

export default function HomeLoadingAnimation({ onLoadingComplete }: HomeLoadingAnimationProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowContent(true);
            onLoadingComplete?.();
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5; // Random increment between 5-20
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  if (showContent) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
      {/* Logo/Image */}
      <div className="relative mb-8">
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <Image
            src="/images/logo.png"
            alt="Healthcare Therapy Center"
            fill
            className="object-contain animate-pulse"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>

      {/* Loading Text */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#B1873F] mb-2 animate-fade-in">
          Healthcare Therapy Center
        </h2>
        <p className="text-gray-600 text-sm md:text-base animate-fade-in-delay">
          Loading your experience...
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 md:w-80 bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-gradient-to-r from-[#B1873F] to-[#9e7736] h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>

      {/* Progress Percentage */}
      <div className="text-sm text-gray-500 animate-fade-in-delay-2">
        {Math.round(loadingProgress)}%
      </div>

      {/* Loading Dots */}
      <div className="flex space-x-1 mt-4">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="w-2 h-2 bg-[#B1873F] rounded-full animate-bounce"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>

      {/* Healthcare Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Heart Icon */}
        <div className="absolute top-1/4 left-1/4 animate-float">
          <svg className="w-8 h-8 text-[#B1873F]/30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>

        {/* Cross Icon */}
        <div className="absolute top-1/3 right-1/4 animate-float-delay">
          <svg className="w-6 h-6 text-[#B1873F]/40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z"/>
          </svg>
        </div>

        {/* Stethoscope Icon */}
        <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
          <svg className="w-7 h-7 text-[#B1873F]/35" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>

        {/* Pill Icon */}
        <div className="absolute bottom-1/3 right-1/3 animate-float-delay-3">
          <svg className="w-5 h-5 text-[#B1873F]/25" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>

        {/* Plus Icon */}
        <div className="absolute top-1/2 left-1/6 animate-float-delay-4">
          <svg className="w-6 h-6 text-[#B1873F]/30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </div>

        {/* Shield Icon */}
        <div className="absolute top-1/2 right-1/6 animate-float-delay-5">
          <svg className="w-7 h-7 text-[#B1873F]/35" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
          </svg>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#B1873F]/20 rounded-full animate-ping" />
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#B1873F]/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#B1873F]/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-[#B1873F]/30 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
    </div>
  );
} 