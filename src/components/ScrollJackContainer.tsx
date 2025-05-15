import React, { useEffect, useRef } from 'react';
import { useScrollJack } from './scroll-jack/use-scroll-jack';
import { createModifiedSection } from './scroll-jack/utils';
import ScrollJackTitle from './scroll-jack/ScrollJackTitle';
import NavigationDots from './scroll-jack/NavigationDots';
import { ScrollJackContainerProps } from './scroll-jack/types';

const ScrollJackContainer: React.FC<ScrollJackContainerProps> = ({ children, titles, triggerRef }) => {
  const {
    containerRef,
    activeSection,
    previousSection,
    animationDirection,
    sectionCount,
    hasReachedEnd,
    shouldEnableScrollJack,
    setActiveSection,
    setPreviousSection,
    setAnimationDirection,
    setHasReachedEnd,
    setShouldEnableScrollJack
  } = useScrollJack(children);

  const handleSectionChange = (index: number) => {
    setPreviousSection(activeSection);
    setAnimationDirection(index > activeSection ? 'up' : 'down');
    setActiveSection(index);
    setHasReachedEnd(index === sectionCount - 1);
  };

  // Use Intersection Observer to detect when the container reaches the top of the viewport
  useEffect(() => {
    if (!triggerRef?.current) return;

    const options = {
      root: null, // use viewport as root
      rootMargin: "0px",
      threshold: 0.01 // trigger when just a tiny bit is visible
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        // Check if the top of the element is at the top of the viewport
        const rect = entry.boundingClientRect;
        if (rect.top <= 1) { // Small threshold for better UX
          setShouldEnableScrollJack(true);
        } else {
          setShouldEnableScrollJack(false);
        }
      } else {
        // If not intersecting and scrolling up from below the element
        if (entry.boundingClientRect.top > 0) {
          setShouldEnableScrollJack(false);
        }
      }
    }, options);

    observer.observe(triggerRef.current);

    return () => {
      if (triggerRef.current) {
        observer.unobserve(triggerRef.current);
      }
    };
  }, [triggerRef, setShouldEnableScrollJack]);

  // Reset scroll position when reaching end or beginning
  useEffect(() => {
    if (hasReachedEnd) {
      window.scrollTo(0, 0);
    }
  }, [hasReachedEnd]);
  
  // Use provided titles or default to section numbers
  const sectionTitles = titles || Array.from({ length: sectionCount }, (_, i) => `Section ${i + 1}`);
  
  return (
    <div 
      ref={containerRef} 
      className={`${shouldEnableScrollJack ? 'h-screen overflow-hidden' : 'h-auto'} relative ${hasReachedEnd ? 'static' : ''}`}
    >
      {/* Fixed title display component - only show when scroll-jacking is enabled */}
      {shouldEnableScrollJack && (
        <ScrollJackTitle 
          titles={sectionTitles} 
          activeSection={activeSection}
          previousSection={previousSection}
          animationDirection={animationDirection}
        />
      )}
      
      {/* Render sections with proper vertical centering */}
      <div className={`${shouldEnableScrollJack ? 'absolute inset-0' : 'relative'} ${hasReachedEnd ? 'pb-screen' : ''}`}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            // Only apply scroll-jack transformations when enabled
            if (shouldEnableScrollJack) {
              return createModifiedSection(child, index, activeSection, hasReachedEnd, sectionCount);
            }
            // Otherwise render the child normally
            return child;
          }
          return child;
        })}
      </div>
      
      {/* Navigation dots component - only show when scroll-jacking is enabled */}
      {shouldEnableScrollJack && (
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
