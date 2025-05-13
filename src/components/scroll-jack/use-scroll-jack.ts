
import React, { useEffect, useRef, useState } from 'react';
import { extractSectionTitles } from './utils';

export const useScrollJack = (children: React.ReactNode) => {
  // Create refs and state in consistent order (prevents React hook order errors)
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [previousSection, setPreviousSection] = useState<number | null>(null);
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down'>('up');
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Add scroll sensitivity threshold
  const scrollThreshold = useRef(50); // Higher value = less sensitive
  const scrollAccumulator = useRef(0);
  const transitionTimeoutRef = useRef<number | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  
  const childrenArray = React.Children.toArray(children);
  const sectionCount = childrenArray.length;
  
  // Extract titles from each section for the fixed title
  const sectionTitles = extractSectionTitles(children);
  
  // Handle cleanup of timeouts
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Allow normal scrolling if we've reached the end
      if (hasReachedEnd) {
        return; // Let the event propagate naturally
      }
      
      // Prevent default in all other cases while in scrolljack mode
      e.preventDefault();
      
      // Don't process scroll if already scrolling
      if (isScrolling || isTransitioning) return;
      
      // Accumulate scroll value to reduce sensitivity
      scrollAccumulator.current += Math.abs(e.deltaY);
      
      // Only trigger scroll action if the accumulated value exceeds the threshold
      if (scrollAccumulator.current > scrollThreshold.current) {
        setIsScrolling(true);
        
        // Determine scroll direction
        const direction = e.deltaY > 0 ? 1 : -1;
        
        // Only allow downward scrolling and only if not at the end
        if (direction > 0) {
          // Set animation direction based on scroll direction
          setAnimationDirection('up');
          
          // Store previous section before updating to new one
          setPreviousSection(activeSection);
          
          // Calculate new active section
          const newSection = Math.min(activeSection + 1, sectionCount - 1);
          
          // Check if we've reached the end of scroll sections
          if (newSection === sectionCount - 1) {
            setActiveSection(newSection);
            
            // Set a flag to release scroll control after last section is shown
            scrollTimeoutRef.current = window.setTimeout(() => {
              setHasReachedEnd(true);
            }, 700); // Delay before releasing scroll control
          } else {
            setActiveSection(newSection);
          }
        } else if (direction < 0 && activeSection > 0) {
          // Allow scrolling up if not at the first section
          setAnimationDirection('down');
          setPreviousSection(activeSection);
          setActiveSection(Math.max(0, activeSection - 1));
        }
        
        // Reset accumulator after action is triggered
        scrollAccumulator.current = 0;
        
        // Add delay before allowing another scroll
        transitionTimeoutRef.current = window.setTimeout(() => {
          setIsScrolling(false);
        }, 700); // Adjust timing as needed for smooth transitions
      }
    };
    
    // Add the wheel event listener to the container
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
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
