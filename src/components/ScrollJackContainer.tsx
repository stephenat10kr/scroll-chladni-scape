
import React, { useEffect, useRef } from 'react';
import { useScrollJack } from './scroll-jack/use-scroll-jack';
import { createModifiedSection } from './scroll-jack/utils';
import ScrollJackTitle from './scroll-jack/ScrollJackTitle';
import NavigationDots from './scroll-jack/NavigationDots';
import { ScrollJackContainerProps } from './scroll-jack/types';

const ScrollJackContainer: React.FC<ScrollJackContainerProps> = ({ children, titles, initialEnabled = false }) => {
  const scrollJackRef = useRef<HTMLDivElement>(null);
  
  const {
    containerRef,
    activeSection,
    previousSection,
    animationDirection,
    sectionCount,
    hasReachedEnd,
    scrollJackEnabled,
    setActiveSection,
    setPreviousSection,
    setAnimationDirection,
    setHasReachedEnd,
    setScrollJackEnabled
  } = useScrollJack(children, initialEnabled);

  // Use IntersectionObserver to detect when the scroll-jack container is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Enable scroll jacking when scrolling down into the container
          if (entry.isIntersecting && window.scrollY > window.innerHeight) {
            setScrollJackEnabled(true);
            console.log("Scroll-jacking enabled");
          } 
          // Disable scroll jacking when scrolling up into blue section
          else if (!entry.isIntersecting && window.scrollY < window.innerHeight) {
            setScrollJackEnabled(false);
            console.log("Scroll-jacking disabled");
          }
        });
      },
      { 
        threshold: 0.1,  // Trigger when 10% of the element is visible
        rootMargin: "-20% 0px" // Trigger slightly before the element is visible
      }
    );

    if (scrollJackRef.current) {
      observer.observe(scrollJackRef.current);
    }

    return () => {
      if (scrollJackRef.current) {
        observer.unobserve(scrollJackRef.current);
      }
    };
  }, [setScrollJackEnabled]);

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
  
  return (
    <div 
      ref={(el) => {
        // Combine the refs
        if (el) {
          containerRef.current = el;
          scrollJackRef.current = el;
        }
      }}
      className={`h-screen overflow-hidden relative ${hasReachedEnd ? 'static' : ''}`}
    >
      {/* Fixed title display component */}
      <ScrollJackTitle 
        titles={sectionTitles} 
        activeSection={activeSection}
        previousSection={previousSection}
        animationDirection={animationDirection}
      />
      
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
      <NavigationDots 
        sectionCount={sectionCount} 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
    </div>
  );
};

export default ScrollJackContainer;
