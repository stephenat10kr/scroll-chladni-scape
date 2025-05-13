
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
  const scrollThreshold = 20; // Lower value = more sensitive (reduced further from 30)
  const scrollAccumulator = useRef(0);
  
  // Track if we've reached the end of the scroll sections
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  // Track if we're transitioning to the next content
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Add a ref to track last direction for more reliable section 3 transitions
  const lastDirectionRef = useRef<number>(0);
  
  // Extract titles from each section for the fixed title
  const sectionTitles = extractSectionTitles(children);
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If we're currently transitioning, don't handle wheel events
      if (isTransitioning) return;
      
      // If we've reached the end and scrolling down further, allow normal page scrolling
      if (hasReachedEnd && e.deltaY > 0) {
        return; // Let the event propagate naturally for normal scrolling
      }
      
      // If we're at the first section and scrolling up, allow normal page scrolling up
      if (activeSection === 0 && e.deltaY < 0) {
        return; // Let the event propagate naturally for normal scrolling
      }
      
      // In all other cases, handle scroll-jacking
      e.preventDefault();
      
      if (isScrolling) return;
      
      // Store last direction to help with section 3 reliability
      lastDirectionRef.current = e.deltaY > 0 ? 1 : -1;
      
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
        
        // Special handling for section 3 (index 2)
        if (activeSection === 1 && direction > 0) {
          // Going from section 2 to section 3
          console.log("Trying to go to section 3");
          
          // Force the activeSection to be 2 (section 3)
          setActiveSection(2);
          
          // If this is the last section, handle end of section logic
          if (2 === sectionCount - 1) {
            setHasReachedEnd(true);
            setIsTransitioning(true);
            
            setTimeout(() => {
              setIsTransitioning(false);
            }, 800);
          }
        } else {
          // Normal section navigation
          if (newSection === sectionCount - 1) {
            // We've reached the last section
            if (direction > 0) {
              setHasReachedEnd(true);
              setIsTransitioning(true);
              
              setTimeout(() => {
                setIsTransitioning(false);
              }, 800);
            }
          } else {
            // We're not at the last section, ensure hasReachedEnd is false
            setHasReachedEnd(false);
          }
          
          setActiveSection(newSection);
          console.log(`Navigating to section: ${newSection}`);
        }
        
        // Reset accumulator after action is triggered
        scrollAccumulator.current = 0;
        
        // Shorter delay before allowing another scroll
        setTimeout(() => {
          setIsScrolling(false);
        }, 500);
      }
    };
    
    const handleScroll = () => {
      // If we're transitioning, don't handle scroll events
      if (isTransitioning) return;
      
      // If user has scrolled back up the page and the container is in view again,
      // re-enable scrolljacking
      if (hasReachedEnd && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        
        // If the container is back in view and we're scrolling up
        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
          // Add some position check to make sure we're really scrolling up into the container
          if (rect.bottom < window.innerHeight * 1.5) {
            setHasReachedEnd(false);
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
  }, [activeSection, isScrolling, sectionCount, hasReachedEnd, isTransitioning]);

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
