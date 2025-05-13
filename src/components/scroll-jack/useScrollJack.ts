
import { useEffect, useRef, useState } from 'react';

export const useScrollJack = (sectionCount: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [previousSection, setPreviousSection] = useState<number | null>(null);
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down'>('up');
  const [allSectionsViewed, setAllSectionsViewed] = useState(false);
  
  // Add scroll sensitivity threshold with a slightly higher value for smoother scrolling
  const scrollThreshold = 30; // Lower value = more sensitive, adjust based on testing
  const scrollAccumulator = useRef(0);
  
  // Track if we've scrolled past the container
  const scrolledPast = useRef(false);
  // Track if we're above the container
  const scrolledAbove = useRef(false);
  // Track last scroll timestamp for debouncing
  const lastScrollTime = useRef(Date.now());
  // Scroll debounce time in ms
  const scrollDebounceTime = 50;
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Debounce rapid scroll events
      const now = Date.now();
      if (now - lastScrollTime.current < scrollDebounceTime) {
        e.preventDefault();
        return;
      }
      lastScrollTime.current = now;
      
      const container = containerRef.current;
      if (!container) return;
      
      // Get container position relative to viewport
      const containerRect = container.getBoundingClientRect();
      
      // Check if we're above the container
      if (containerRect.top > window.innerHeight) {
        scrolledAbove.current = true;
        return; // We're above the container, use normal scrolling
      }
      
      // Check if we've scrolled completely past the container
      if (containerRect.bottom <= 0) {
        scrolledPast.current = true;
        scrolledAbove.current = false;
        return; // We're below the container, use normal scrolling
      }
      
      // If we're scrolling back up into the container from below
      if (scrolledPast.current && containerRect.bottom > 0 && e.deltaY < 0) {
        e.preventDefault();
        // Reset the flag when scrolling back into view
        scrolledPast.current = false;
        // Re-enable scrolljacking by resetting allSectionsViewed
        setAllSectionsViewed(false);
        setActiveSection(sectionCount - 1); // Start from the last section when scrolling up
        return;
      }
      
      // If we're scrolling down into the container from above
      if (scrolledAbove.current && containerRect.top < window.innerHeight && e.deltaY > 0) {
        e.preventDefault();
        // Reset the flag when scrolling back into view
        scrolledAbove.current = false;
        // Re-enable scrolljacking by resetting allSectionsViewed
        setAllSectionsViewed(false);
        setActiveSection(0); // Start from the first section when scrolling down
        return;
      }
      
      // If all sections have been viewed and we're not scrolling back in, don't interfere
      if (allSectionsViewed && !scrolledPast.current && !scrolledAbove.current) {
        return;
      }
      
      // Check if the container is visible in the viewport
      const isContainerVisible = 
        containerRect.top < window.innerHeight && 
        containerRect.bottom > 0;
      
      // Only apply scroll jacking if the container is visible in the viewport
      if (isContainerVisible && !scrolledPast.current && !scrolledAbove.current) {
        e.preventDefault();
        
        if (isScrolling) return;
        
        // Accumulate scroll value for smoother transition
        scrollAccumulator.current += Math.abs(e.deltaY);
        
        // Only trigger scroll action if accumulated value exceeds threshold
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
          
          // If we're at the last section and trying to move down,
          // set flag that all sections have been viewed
          if (activeSection === sectionCount - 1 && direction > 0) {
            setAllSectionsViewed(true);
            setIsScrolling(false);
            return;
          }
          
          // If we're at the first section and trying to move up,
          // allow normal scroll behavior
          if (activeSection === 0 && direction < 0) {
            scrolledAbove.current = true;
            setIsScrolling(false);
            return;
          }
          
          setActiveSection(newSection);
          
          // Reset accumulator after action is triggered
          scrollAccumulator.current = 0;
          
          // Add delay before allowing another scroll
          setTimeout(() => {
            setIsScrolling(false);
          }, 700); // Animation timing
        }
      }
    };
    
    // Use passive: false to allow preventDefault()
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [activeSection, isScrolling, sectionCount, allSectionsViewed]);

  const handleSectionChange = (index: number) => {
    if (isScrolling) return;
    
    setPreviousSection(activeSection);
    setAnimationDirection(index > activeSection ? 'up' : 'down');
    setActiveSection(index);
  };

  return {
    containerRef,
    activeSection,
    previousSection,
    animationDirection,
    allSectionsViewed,
    handleSectionChange
  };
};
