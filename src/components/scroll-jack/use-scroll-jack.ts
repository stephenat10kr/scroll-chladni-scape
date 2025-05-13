
import React, { useEffect, useRef, useState } from 'react';
import { extractSectionTitles } from './utils';

export const useScrollJack = (children: React.ReactNode) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [previousSection, setPreviousSection] = useState<number | null>(null);
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down'>('up');
  const childrenArray = React.Children.toArray(children);
  const sectionCount = childrenArray.length;
  
  // Add scroll sensitivity threshold
  const scrollThreshold = 50; // Higher value = less sensitive
  const scrollAccumulator = useRef(0);
  
  // Track if we've reached the end of the scroll sections
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  // Track if we've seen section 3 (for triggering normal scrolling)
  const hasViewedSection3Ref = useRef(false);
  // Add a delay after showing section 3 before allowing normal scrolling
  const section3TimerRef = useRef<number | null>(null);
  
  // Extract titles from each section for the fixed title
  const sectionTitles = extractSectionTitles(children);
  
  useEffect(() => {
    // When we reach the last section, mark it as viewed after a delay
    if (activeSection === sectionCount - 1 && !hasViewedSection3Ref.current) {
      // Clear any existing timer
      if (section3TimerRef.current) {
        window.clearTimeout(section3TimerRef.current);
      }
      
      // Set a timer to allow some time for the user to view section 3
      section3TimerRef.current = window.setTimeout(() => {
        hasViewedSection3Ref.current = true;
        console.log("Section 3 viewed, normal scrolling enabled");
      }, 800); // Give time for animation and viewing
    }
    
    return () => {
      // Clean up timer on unmount or section change
      if (section3TimerRef.current) {
        window.clearTimeout(section3TimerRef.current);
        section3TimerRef.current = null;
      }
    };
  }, [activeSection, sectionCount]);
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If we're already scrolling, don't process another scroll
      if (isScrolling) return;
      
      // If we've viewed section 3 and we're scrolling down, enable normal scrolling
      if (hasViewedSection3Ref.current && activeSection === sectionCount - 1 && e.deltaY > 0) {
        setHasReachedEnd(true);
        return; // Allow normal scrolling behavior
      }
      
      // If we're at the first section and scrolling up, allow normal page scrolling up
      if (activeSection === 0 && e.deltaY < 0) {
        return; // Let the event propagate naturally for normal scrolling
      }
      
      // In all other cases, handle scroll-jacking
      e.preventDefault();
      
      // Accumulate scroll value to reduce sensitivity
      scrollAccumulator.current += Math.abs(e.deltaY);
      
      // Only trigger scroll action if the accumulated value exceeds the threshold
      if (scrollAccumulator.current > scrollThreshold) {
        setIsScrolling(true);
        
        // Determine scroll direction
        const direction = e.deltaY > 0 ? 1 : -1;
        
        // Set animation direction based on scroll direction
        setAnimationDirection(direction > 0 ? 'up' : 'down');
        
        // Store previous section before updating to new one
        setPreviousSection(activeSection);
        
        // Calculate new active section
        const newSection = Math.min(
          Math.max(0, activeSection + direction),
          sectionCount - 1
        );
        
        setActiveSection(newSection);
        
        // Reset accumulator after action is triggered
        scrollAccumulator.current = 0;
        
        // Add delay before allowing another scroll
        setTimeout(() => {
          setIsScrolling(false);
        }, 700); // Adjust timing as needed
      }
    };
    
    const handleScroll = () => {
      // If the user has scrolled back up the page and the container is in view again,
      // re-enable scrolljacking
      if (hasReachedEnd && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        
        // If the container is back in view and we're scrolling up
        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
          // Add some position check to make sure we're really scrolling up into the container
          if (rect.bottom < window.innerHeight * 1.5) {
            setHasReachedEnd(false);
            hasViewedSection3Ref.current = false; // Reset the section 3 viewed state
            // Force active section to be the last one
            setActiveSection(sectionCount - 1);
          }
        }
      }
    };
    
    // Add scroll event listener for re-entering the scrolljack container
    window.addEventListener('scroll', handleScroll);
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [activeSection, isScrolling, sectionCount, hasReachedEnd]);

  return {
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
    setHasReachedEnd,
  };
};
