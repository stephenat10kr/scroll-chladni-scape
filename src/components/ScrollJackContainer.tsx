
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
    isScrollJackActive,
    setActiveSection,
    setPreviousSection,
    setAnimationDirection,
    setHasReachedEnd,
    setIsScrollJackActive
  } = useScrollJack(children);

  const handleSectionChange = (index: number) => {
    setPreviousSection(activeSection);
    setAnimationDirection(index > activeSection ? 'up' : 'down');
    setActiveSection(index);
    setHasReachedEnd(index === sectionCount - 1);
  };

  // Use Intersection Observer to detect when the component enters/exits viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        // Only activate scroll-jacking when the container is visible
        if (entry.isIntersecting && !hasReachedEnd) {
          setIsScrollJackActive(true);
          document.body.style.overflow = 'hidden';
        } else if (!entry.isIntersecting) {
          setIsScrollJackActive(false);
          document.body.style.overflow = 'auto';
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% of the component is visible
    );

    observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      document.body.style.overflow = 'auto';
    };
  }, [hasReachedEnd, setIsScrollJackActive]);

  // Reset scroll position when reaching end
  useEffect(() => {
    if (hasReachedEnd) {
      document.body.style.overflow = 'auto';
      setIsScrollJackActive(false);
    }
  }, [hasReachedEnd, setIsScrollJackActive]);
  
  // Use provided titles or default to section numbers
  const sectionTitles = titles || Array.from({ length: sectionCount }, (_, i) => `Section ${i + 1}`);
  
  return (
    <div 
      ref={containerRef} 
      className={`h-screen ${isScrollJackActive ? 'overflow-hidden' : 'overflow-visible'} relative`}
      id="scrolljack-container"
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
      <div className={`absolute inset-0 ${hasReachedEnd ? 'pb-screen' : ''}`}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return createModifiedSection(child, index, activeSection, hasReachedEnd, sectionCount);
          }
          return child;
        })}
      </div>
      
      {/* Navigation dots component */}
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
