
import { useEffect, useRef, useState } from 'react';

export const useScrollJack = (sectionCount: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [previousSection, setPreviousSection] = useState<number | null>(null);
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down'>('up');
  const [allSectionsViewed, setAllSectionsViewed] = useState(false);
  
  // Add scroll sensitivity threshold
  const scrollThreshold = 50; // Higher value = less sensitive
  const scrollAccumulator = useRef(0);
  
  // Track if we've scrolled past the container
  const scrolledPast = useRef(false);
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      // Get container position relative to viewport
      const containerRect = container.getBoundingClientRect();
      const isContainerVisible = 
        containerRect.top < window.innerHeight && 
        containerRect.bottom > 0;
      
      // Check if we've scrolled completely past the container
      if (containerRect.bottom <= 0) {
        scrolledPast.current = true;
        return; // We're below the container, use normal scrolling
      }
      
      // If we're scrolling back up into the container from below
      if (scrolledPast.current && containerRect.bottom > 0 && e.deltaY < 0) {
        // Reset the flag when scrolling back into view
        scrolledPast.current = false;
        // Re-enable scrolljacking by resetting allSectionsViewed
        setAllSectionsViewed(false);
        setActiveSection(sectionCount - 1); // Start from the last section when scrolling up
      }
      
      // If all sections have been viewed and we're not scrolling back up into container, don't interfere
      if (allSectionsViewed && !scrolledPast.current) {
        return;
      }
      
      // Only apply scroll jacking if the container is visible in the viewport
      if (isContainerVisible && !scrolledPast.current) {
        e.preventDefault();
        
        if (isScrolling) return;
        
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
          
          // If we're at the last section and trying to move down,
          // set flag that all sections have been viewed
          if (activeSection === sectionCount - 1 && direction > 0) {
            setAllSectionsViewed(true);
            setIsScrolling(false);
            return;
          }
          
          setActiveSection(newSection);
          
          // Reset accumulator after action is triggered
          scrollAccumulator.current = 0;
          
          // Add delay before allowing another scroll
          setTimeout(() => {
            setIsScrolling(false);
          }, 700); // Adjust timing as needed
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
