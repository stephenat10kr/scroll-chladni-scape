
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
  
  // Lower threshold for better responsiveness
  const scrollThreshold = useRef(30); 
  const scrollAccumulator = useRef(0);
  const transitionTimeoutRef = useRef<number | null>(null);
  
  const childrenArray = React.Children.toArray(children);
  const sectionCount = childrenArray.length;
  
  // Extract titles from each section for the fixed title
  const sectionTitles = extractSectionTitles(children);
  
  // Track the last scroll position outside scroll sections
  const lastScrollY = useRef(0);
  const scrollingTimeoutRef = useRef<number | null>(null);
  
  // Add a state to track animation completion
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Handle cleanup of timeouts
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      if (scrollingTimeoutRef.current) {
        clearTimeout(scrollingTimeoutRef.current);
      }
    };
  }, []);
  
  // Observer for intersection with viewport
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Simplified activation logic
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setIsScrollJackActive(true);
            document.body.style.overflow = hasReachedEnd ? 'auto' : 'hidden';
            console.log("ScrollJack activated, isScrollJackActive:", true);
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.1) {
            setIsScrollJackActive(false);
            document.body.style.overflow = 'auto';
            console.log("ScrollJack deactivated, isScrollJackActive:", false);
          }
        });
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
        rootMargin: '0px'
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

    // Simplified wheel event handler
    const handleWheel = (e: WheelEvent) => {
      // Skip if not active or already at the end
      if (!isScrollJackActive || hasReachedEnd) {
        return;
      }
      
      // Prevent default to stop normal scrolling
      e.preventDefault();
      
      // Don't process scroll if already scrolling or animating
      if (isScrolling || isAnimating) return;
      
      // Accumulate scroll delta
      scrollAccumulator.current += Math.abs(e.deltaY);
      
      console.log("Scroll value:", e.deltaY, "accumulated:", scrollAccumulator.current, "threshold:", scrollThreshold.current);
      
      if (scrollAccumulator.current > scrollThreshold.current) {
        // Reset accumulator immediately
        scrollAccumulator.current = 0;
        
        setIsScrolling(true);
        setIsAnimating(true);
        
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
        
        // Add shorter delay for better responsiveness
        transitionTimeoutRef.current = window.setTimeout(() => {
          setIsScrolling(false);
        }, 600);
        
        // Set a separate timeout for animation completion
        scrollingTimeoutRef.current = window.setTimeout(() => {
          setIsAnimating(false);
        }, 700);
      }
    };
    
    // Add the wheel event listener with the proper passive option
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    // Add window scroll listener for detecting re-entry
    window.addEventListener('scroll', handleWindowScroll);
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [activeSection, isScrolling, sectionCount, hasReachedEnd, isScrollJackActive, isAnimating]);

  return {
    activeSection,
    previousSection,
    animationDirection,
    sectionCount,
    sectionTitles,
    hasReachedEnd,
    isScrollJackActive,
    isAnimating,
    setActiveSection,
    setPreviousSection,
    setAnimationDirection,
    setHasReachedEnd,
  };
};
