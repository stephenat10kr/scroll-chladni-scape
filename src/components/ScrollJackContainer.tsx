
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
    // Create a separate element for observation to improve reliability
    const observerTarget = document.createElement('div');
    observerTarget.style.position = 'absolute';
    observerTarget.style.top = '0';
    observerTarget.style.height = '1px'; // Minimal size
    observerTarget.style.width = '100%';
    observerTarget.style.pointerEvents = 'none';
    
    // Add the target to the DOM
    if (scrollJackRef.current) {
      scrollJackRef.current.appendChild(observerTarget);
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        // We only care about the first entry since we're observing a single element
        const entry = entries[0];
        
        if (entry) {
          // Enable scroll jacking when the container enters the viewport
          // and we're scrolling down from the blue section
          if (entry.isIntersecting && window.scrollY > 0) {
            console.log("Scroll-jacking enabled");
            setScrollJackEnabled(true);
          } 
          // Disable scroll jacking when scrolling back up to the blue section
          else if (!entry.isIntersecting && window.scrollY < entry.boundingClientRect.top) {
            console.log("Scroll-jacking disabled");
            setScrollJackEnabled(false);
          }
        }
      },
      { 
        threshold: 0.05,  // Trigger when just a small part of the element is visible
        rootMargin: "-100px 0px" // Adjust this to trigger at the right moment
      }
    );

    // Observe the target element
    observer.observe(observerTarget);

    return () => {
      observer.disconnect();
      if (scrollJackRef.current && scrollJackRef.current.contains(observerTarget)) {
        scrollJackRef.current.removeChild(observerTarget);
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
