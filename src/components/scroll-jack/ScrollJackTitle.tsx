
import React from 'react';

interface ScrollJackTitleProps {
  titles: Array<React.ReactNode>;
  activeSection: number;
  previousSection: number | null;
  animationDirection: 'up' | 'down';
}

const ScrollJackTitle: React.FC<ScrollJackTitleProps> = ({ 
  titles,
  activeSection,
  previousSection,
  animationDirection
}) => {
  return (
    <div className="absolute top-1/2 left-0 w-full z-30 transform -translate-y-1/2 overflow-hidden">
      <div className="text-center relative h-16">
        {titles.map((title, index) => {
          const isActive = index === activeSection;
          const wasActive = index === previousSection;
          
          let titleClass = "text-5xl md:text-7xl font-bold mb-0 text-white absolute w-full left-0 transition-all duration-700 opacity-0";
          
          if (isActive) {
            titleClass += " opacity-100 translate-y-0";
          } else if (wasActive && animationDirection === 'up') {
            titleClass += " -translate-y-20";
          } else if (wasActive && animationDirection === 'down') {
            titleClass += " translate-y-20";
          } else if (index > activeSection) {
            titleClass += " translate-y-20";
          } else if (index < activeSection) {
            titleClass += " -translate-y-20";
          }
          
          return (
            <h1 
              key={`title-${index}`} 
              className={titleClass}
            >
              {title}
            </h1>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollJackTitle;
