
import React from 'react';

interface ScrollableBannerProps {
  height?: string;
}

const ScrollableBanner: React.FC<ScrollableBannerProps> = ({ height = "100vh" }) => {
  return (
    <div 
      className="w-full bg-gradient-to-b from-purple-900 to-indigo-900" 
      style={{ height }}
    >
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center min-h-full">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 text-center">
          Scroll Experience
        </h1>
        <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto text-center mb-12">
          Scroll down to experience our interactive presentation with smooth scrolljacking animations.
        </p>
        <div className="flex flex-col items-center mt-auto pb-8">
          <p className="text-white/70 text-lg mb-4">Scroll Down</p>
          <div className="animate-bounce">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-white/70"
            >
              <path d="M12 5v14"></path>
              <path d="m19 12-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollableBanner;
