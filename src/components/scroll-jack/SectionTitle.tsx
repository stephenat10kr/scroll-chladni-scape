
import React from 'react';

interface SectionTitleProps {
  sectionTitles: React.ReactNode[];
  activeSection: number;
  previousSection: number | null;
  animationDirection: 'up' | 'down';
  allSectionsViewed: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  sectionTitles,
  activeSection,
  previousSection,
  animationDirection,
  allSectionsViewed
}) => {
  if (allSectionsViewed) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 w-full z-30 pt-[200px] pb-0 overflow-hidden">
      <div className="text-center relative h-16">
        {/* Title animations */}
        {sectionTitles.map((title, index) => {
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

export default SectionTitle;
