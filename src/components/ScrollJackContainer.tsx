
import React, { useEffect, useRef, useState } from 'react';
import { useScrollJack } from './scroll-jack/use-scroll-jack';
import { createModifiedSection } from './scroll-jack/utils';
import ScrollJackTitle from './scroll-jack/ScrollJackTitle';
import NavigationDots from './scroll-jack/NavigationDots';
import { ScrollJackContainerProps } from './scroll-jack/types';

const ScrollJackContainer: React.FC<ScrollJackContainerProps> = ({ children, titles }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
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
    scrollHandlerEnabled,
    setScrollHandlerEnabled
  } = useScrollJack(children, isIntersecting);

  const handleSectionChange = (index: number) => {
    setPreviousSection(activeSection);
    setAnimationDirection(index > activeSection ? 'up' : 'down');
    setActiveSection(index);
    setHasReachedEnd(index === sectionCount - 1);
  };

  // Reset scroll position when reaching end or beginning
  useEffect(() => {
    if (hasReachedEnd) {
      window.scrollTo(0, 0);
    }
  }, [hasReachedEnd]);
  
  // Use provided titles or default to section numbers
  const sectionTitles = titles || Array.from({ length: sectionCount }, (_, i) => `Section ${i + 1}`);
  
  // Set up intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the container is at the top of the viewport, enable scroll-jacking
        setIsIntersecting(entry.isIntersecting && entry.boundingClientRect.top <= 0);
        setScrollHandlerEnabled(entry.isIntersecting && entry.boundingClientRect.top <= 0);
      }, 
      { threshold: [0], rootMargin: '0px' }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [setScrollHandlerEnabled]);
  
  return (
    <div 
      ref={containerRef} 
      className={`min-h-screen ${scrollHandlerEnabled ? 'overflow-hidden fixed inset-0' : 'relative'} ${hasReachedEnd ? 'static' : ''}`}
      style={{
        top: scrollHandlerEnabled ? '0px' : 'auto',
        zIndex: scrollHandlerEnabled ? 10 : 'auto',
        height: scrollHandlerEnabled ? '100vh' : 'auto'
      }}
    >
      {/* Fixed title display component */}
      {scrollHandlerEnabled && (
        <ScrollJackTitle 
          titles={sectionTitles} 
          activeSection={activeSection}
          previousSection={previousSection}
          animationDirection={animationDirection}
        />
      )}
      
      {/* Render sections with proper vertical centering */}
      <div className={`${scrollHandlerEnabled ? 'absolute' : 'relative'} inset-0 ${hasReachedEnd ? 'pb-screen' : ''}`}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return scrollHandlerEnabled 
              ? createModifiedSection(child, index, activeSection, hasReachedEnd, sectionCount)
              : child;
          }
          return child;
        })}
      </div>
      
      {/* Navigation dots component */}
      {scrollHandlerEnabled && !hasReachedEnd && (
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
