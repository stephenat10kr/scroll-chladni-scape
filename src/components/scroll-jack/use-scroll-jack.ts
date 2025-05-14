
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
  
  // Add scroll sensitivity threshold and improve debouncing
  const scrollThreshold = useRef(80); // Higher value = less sensitive (increased for smoother behavior)
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
  
  // Observer for intersection with viewport - improved thresholds for smoother activation
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only change state when crossing threshold boundaries to prevent flicker
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
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
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], // More granular thresholds
        rootMargin: '-5% 0px -5% 0px', // Smaller margin for more precise activation
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

    // Improved wheel event handler with better debouncing
    const handleWheel = (e: WheelEvent) => {
      // Only handle wheel events when scrolljack is active
      if (!isScrollJackActive) {
        return; // Skip processing if not in scrolljack mode
      }
      
      // Allow normal scrolling if we've reached the end
      if (hasReachedEnd) {
        return; // Let the event propagate naturally
      }
      
      // Prevent default in all other cases while in scrolljack mode
      e.preventDefault();
      
      // Don't process scroll if already scrolling or animating
      if (isScrolling || isAnimating) return;
      
      // Accumulate scroll value to reduce sensitivity
      scrollAccumulator.current += Math.abs(e.deltaY);
      
      // Log the scroll values for debugging
      console.log("Scroll updated:", scrollAccumulator.current, "combined norm:", scrollAccumulator.current / scrollThreshold.current);
      
      // Only trigger scroll action if the accumulated value exceeds the threshold
      if (scrollAccumulator.current > scrollThreshold.current) {
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
        
        // Reset accumulator after action is triggered
        scrollAccumulator.current = 0;
        
        // Add delay before allowing another scroll - increased for smoother transitions
        transitionTimeoutRef.current = window.setTimeout(() => {
          setIsScrolling(false);
        }, 800);
        
        // Set a separate timeout for animation completion
        scrollingTimeoutRef.current = window.setTimeout(() => {
          setIsAnimating(false);
        }, 900); // Slightly longer than transition time
      }
    };
    
    // Add the wheel event listener to the document with the proper passive option
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
