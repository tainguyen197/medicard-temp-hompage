import React from "react";
import Image from "next/image";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  showLogo?: boolean;
  text?: string;
  showIcons?: boolean;
}

export default function LoadingSpinner({ 
  size = "md", 
  showLogo = true, 
  text = "Loading...",
  showIcons = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 relative">
      {showLogo && (
        <div className="relative mb-4">
          <div className={`relative ${sizeClasses[size]}`}>
            <Image
              src="/images/logo.png"
              alt="Loading"
              fill
              className="object-contain animate-pulse"
            />
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
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
        <span className="text-sm text-gray-600">{text}</span>
      </div>

      {/* Healthcare Icons (optional) */}
      {showIcons && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Heart Icon */}
          <div className="absolute top-1/4 left-1/4 animate-float">
            <svg className="w-6 h-6 text-[#B1873F]/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>

          {/* Cross Icon */}
          <div className="absolute top-1/3 right-1/4 animate-float-delay">
            <svg className="w-5 h-5 text-[#B1873F]/40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z"/>
            </svg>
          </div>

          {/* Plus Icon */}
          <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
            <svg className="w-4 h-4 text-[#B1873F]/35" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2h-4v4z"/>
            </svg>
          </div>

          {/* Shield Icon */}
          <div className="absolute bottom-1/3 right-1/3 animate-float-delay-3">
            <svg className="w-5 h-5 text-[#B1873F]/25" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
} 