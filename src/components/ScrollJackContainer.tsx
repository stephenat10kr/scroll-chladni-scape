
import React, { useEffect } from 'react';
import { useScrollJack } from './scroll-jack/use-scroll-jack';
import { createModifiedSection } from './scroll-jack/utils';
import ScrollJackTitle from './scroll-jack/ScrollJackTitle';
import NavigationDots from './scroll-jack/NavigationDots';
import { ScrollJackContainerProps } from './scroll-jack/types';

const ScrollJackContainer: React.FC<ScrollJackContainerProps> = ({ children, titles }) => {
  const {
    containerRef,
    activeSection,
    previousSection,
    animationDirection,
    sectionCount,
    hasReachedEnd,
    hasReachedStart,
    setActiveSection,
    setPreviousSection,
    setAnimationDirection,
    setHasReachedEnd,
    setHasReachedStart
  } = useScrollJack(children);

  const handleSectionChange = (index: number) => {
    setPreviousSection(activeSection);
    setAnimationDirection(index > activeSection ? 'up' : 'down');
    setActiveSection(index);
    setHasReachedEnd(index === sectionCount - 1);
  };

  // Reset scroll position when reaching end or beginning
  useEffect(() => {
    if (hasReachedEnd || hasReachedStart) {
      window.scrollTo(0, 0);
    }
  }, [hasReachedEnd, hasReachedStart]);
  
  // Use provided titles or default to section numbers
  const sectionTitles = titles || Array.from({ length: sectionCount }, (_, i) => `Section ${i + 1}`);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative h-screen w-full overflow-hidden ${hasReachedEnd || hasReachedStart ? '' : 'fixed top-0 left-0'}`}
      style={{ 
        zIndex: hasReachedEnd || hasReachedStart ? 'auto' : 10 
      }}
    >
      {/* Fixed title display component */}
      <ScrollJackTitle 
        titles={sectionTitles} 
        activeSection={activeSection}
        previousSection={previousSection}
        animationDirection={animationDirection}
      />
      
      {/* Render sections with proper vertical centering */}
      <div className="w-full h-full">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return createModifiedSection(child, index, activeSection, hasReachedEnd || hasReachedStart, sectionCount);
          }
          return child;
        })}
      </div>
      
      {/* Navigation dots component */}
      <NavigationDots 
        sectionCount={sectionCount} 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
    </div>
  );
};

export default ScrollJackContainer;
