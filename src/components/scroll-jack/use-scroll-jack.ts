
import React, { useEffect, useRef, useState } from 'react';
import { extractSectionTitles } from './utils';

export const useScrollJack = (children: React.ReactNode, containerRef: React.RefObject<HTMLDivElement>) => {
  // Create refs and state in consistent order (prevents React hook order errors)
  const [activeSection, setActiveSection] = useState(0);
  const [previousSection, setPreviousSection] = useState<number | null>(null);
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down'>('up');
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [isScrollJackActive, setIsScrollJackActive] = useState(false);
  
  // Add scroll sensitivity threshold
  const scrollThreshold = useRef(50); // Higher value = less sensitive
  const scrollAccumulator = useRef(0);
  const transitionTimeoutRef = useRef<number | null>(null);
  
  const childrenArray = React.Children.toArray(children);
  const sectionCount = childrenArray.length;
  
  // Extract titles from each section for the fixed title
  const sectionTitles = extractSectionTitles(children);
  
  // Track the last scroll position outside scroll sections
  const lastScrollY = useRef(0);
  
  // Handle cleanup of timeouts
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);
  
  // Observer for intersection with viewport
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the container is at least 25% visible in the viewport
          if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
            setIsScrollJackActive(true);
            document.body.style.overflow = hasReachedEnd ? 'auto' : 'hidden';
          } else {
            setIsScrollJackActive(false);
            document.body.style.overflow = 'auto';
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-10% 0px -10% 0px', // Activate a bit before it's fully in view
      }
    );
    
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasReachedEnd]);
  
  useEffect(() => {
    // Track document scroll position to detect when to re-enter scroll-jack
    const handleWindowScroll = () => {
      if (hasReachedEnd && isScrollJackActive) {
        lastScrollY.current = window.scrollY;
        
        // If user has scrolled back to the section height area and is continuing upward
        if (lastScrollY.current < window.innerHeight * 0.5 && window.scrollY === 0) {
          // Re-enter the scroll-jack mode at the last section
          setHasReachedEnd(false);
          setActiveSection(sectionCount - 1);
          setPreviousSection(null);
          setAnimationDirection('down');
          
          // Reset body scroll position
          document.body.style.overflow = 'hidden';
          window.scrollTo(0, 0);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Only handle wheel events when scrolljack is active
      if (!isScrollJackActive) return;
      
      // Allow normal scrolling if we've reached the end
      if (hasReachedEnd) {
        return; // Let the event propagate naturally
      }
      
      // Prevent default in all other cases while in scrolljack mode
      e.preventDefault();
      
      // Don't process scroll if already scrolling
      if (isScrolling) return;
      
      // Accumulate scroll value to reduce sensitivity
      scrollAccumulator.current += Math.abs(e.deltaY);
      
      // Only trigger scroll action if the accumulated value exceeds the threshold
      if (scrollAccumulator.current > scrollThreshold.current) {
        setIsScrolling(true);
        
        // Determine scroll direction
        const direction = e.deltaY > 0 ? 1 : -1;
        
        if (direction > 0) {
          // Scrolling down
          setAnimationDirection('up');
          setPreviousSection(activeSection);
          
          if (activeSection < sectionCount - 1) {
            // Move to next section
            setActiveSection(activeSection + 1);
          } else {
            // We're at the last section, allow normal scrolling
            setHasReachedEnd(true);
            document.body.style.overflow = 'auto';
          }
        } else if (direction < 0) {
          // Scrolling up
          if (activeSection > 0) {
            setAnimationDirection('down');
            setPreviousSection(activeSection);
            setActiveSection(activeSection - 1);
          }
        }
        
        // Reset accumulator after action is triggered
        scrollAccumulator.current = 0;
        
        // Add delay before allowing another scroll
        transitionTimeoutRef.current = window.setTimeout(() => {
          setIsScrolling(false);
        }, 700); // Adjust timing as needed for smooth transitions
      }
    };
    
    // Add the wheel event listener to the document when scrolljack is active
    if (isScrollJackActive) {
      document.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    // Add window scroll listener for detecting re-entry
    window.addEventListener('scroll', handleWindowScroll);
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [activeSection, isScrolling, sectionCount, hasReachedEnd, isScrollJackActive]);

  // Update types exported to match new functionality
  return {
    activeSection,
    previousSection,
    animationDirection,
    sectionCount,
    sectionTitles,
    hasReachedEnd,
    isScrollJackActive,
    setActiveSection,
    setPreviousSection,
    setAnimationDirection,
    setHasReachedEnd,
  };
};
