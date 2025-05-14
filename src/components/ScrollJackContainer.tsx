
import React, { useEffect, useRef } from 'react';
import { useScrollJack } from './scroll-jack/use-scroll-jack';
import { createModifiedSection } from './scroll-jack/utils';
import ScrollJackTitle from './scroll-jack/ScrollJackTitle';
import NavigationDots from './scroll-jack/NavigationDots';
import { ScrollJackContainerProps } from './scroll-jack/types';

const ScrollJackContainer: React.FC<ScrollJackContainerProps> = ({ children, titles }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    activeSection,
    previousSection,
    animationDirection,
    sectionCount,
    hasReachedEnd,
    setActiveSection,
    setPreviousSection,
    setAnimationDirection,
    setHasReachedEnd,
    isScrollJackActive
  } = useScrollJack(children, containerRef);

  const handleSectionChange = (index: number) => {
    setPreviousSection(activeSection);
    setAnimationDirection(index > activeSection ? 'up' : 'down');
    setActiveSection(index);
    setHasReachedEnd(index === sectionCount - 1);
  };

  // Reset scroll position when reaching end or beginning
  useEffect(() => {
    if (hasReachedEnd) {
      window.scrollTo(0, window.scrollY);
    }
  }, [hasReachedEnd]);
  
  // Use provided titles or default to section numbers
  const sectionTitles = titles || Array.from({ length: sectionCount }, (_, i) => `Section ${i + 1}`);
  
  return (
    <div 
      ref={containerRef} 
      className={`min-h-screen relative ${hasReachedEnd ? 'pointer-events-auto' : isScrollJackActive ? 'overflow-hidden' : ''}`}
    >
      {/* Fixed title display component */}
      {isScrollJackActive && (
        <ScrollJackTitle 
          titles={sectionTitles} 
          activeSection={activeSection}
          previousSection={previousSection}
          animationDirection={animationDirection}
        />
      )}
      
      {/* Render sections with proper vertical centering */}
      <div className={`${isScrollJackActive ? 'absolute inset-0' : ''} ${hasReachedEnd ? 'pb-screen' : ''}`}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return isScrollJackActive ? 
              createModifiedSection(child, index, activeSection, hasReachedEnd, sectionCount) :
              child;
          }
          return child;
        })}
      </div>
      
      {/* Navigation dots component - only show when scrolljack is active */}
      {isScrollJackActive && (
        <NavigationDots 
          sectionCount={sectionCount} 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
      )}
    </div>
  );
};

export default ScrollJackContainer;
