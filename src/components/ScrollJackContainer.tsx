
import React from 'react';
import { useScrollJack } from './scroll-jack/use-scroll-jack';
import { createModifiedSection } from './scroll-jack/utils';
import ScrollJackTitle from './scroll-jack/ScrollJackTitle';
import NavigationDots from './scroll-jack/NavigationDots';
import { ScrollJackContainerProps } from './scroll-jack/types';

const ScrollJackContainer: React.FC<ScrollJackContainerProps> = ({ children }) => {
  const {
    containerRef,
    activeSection,
    previousSection,
    animationDirection,
    sectionCount,
    sectionTitles,
    hasReachedEnd,
    setActiveSection,
    setPreviousSection,
    setAnimationDirection,
    setHasReachedEnd
  } = useScrollJack(children);

  const handleSectionChange = (index: number) => {
    setPreviousSection(activeSection);
    setAnimationDirection(index > activeSection ? 'up' : 'down');
    setActiveSection(index);
    setHasReachedEnd(index === sectionCount - 1);
  };
  
  return (
    <div ref={containerRef} className="h-screen overflow-hidden relative">
      {/* Fixed title display component */}
      <ScrollJackTitle 
        titles={sectionTitles} 
        activeSection={activeSection}
        previousSection={previousSection}
        animationDirection={animationDirection}
      />
      
      {/* Render modified sections */}
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return createModifiedSection(child, index, activeSection, hasReachedEnd, sectionCount);
        }
        return child;
      })}
      
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
