
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
  const [hasReachedTop, setHasReachedTop] = useState(false);
  const [isEnteringFromBottom, setIsEnteringFromBottom] = useState(false);
  const [isEnteringFromTop, setIsEnteringFromTop] = useState(false);
  
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

  // Listen for custom events to control active section
  useEffect(() => {
    const handleSetActiveSection = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.section !== undefined) {
        console.log("Setting active section via custom event:", customEvent.detail.section);
        setActiveSection(customEvent.detail.section);
        
        // Set entering direction based on where we're coming from
        if (customEvent.detail.fromBelow) {
          setIsEnteringFromBottom(true);
          setIsEnteringFromTop(false);
        } else if (customEvent.detail.fromAbove) {
          setIsEnteringFromTop(true);
          setIsEnteringFromBottom(false);
        }
        
        // Reset reached states when re-entering
        setHasReachedEnd(false);
        setHasReachedTop(false);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('set-active-section', handleSetActiveSection);
    }

    return () => {
      if (container) {
        container.removeEventListener('set-active-section', handleSetActiveSection);
      }
    };
  }, []);
  
  useEffect(() => {
    // Track document scroll position to detect when to re-enter scroll-jack
    const handleWindowScroll = () => {
      if (hasReachedEnd || hasReachedTop) {
        lastScrollY.current = window.scrollY;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Allow normal scrolling if we've reached the end or top
      if (hasReachedEnd || hasReachedTop) {
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
            
            // Ensure this state change is communicated to parent components
            console.log("Reached end of scroll-jack sections, allowing downward scroll");
          }
        } else if (direction < 0) {
          // Scrolling up
          if (activeSection > 0 || isEnteringFromBottom) {
            setAnimationDirection('down');
            setPreviousSection(activeSection);
            
            // If we're entering from the bottom and we're at the last section, 
            // we don't want to decrement activeSection yet
            if (!(isEnteringFromBottom && activeSection === sectionCount - 1)) {
              setActiveSection(prevActiveSection => Math.max(0, prevActiveSection - 1));
            }
            setIsEnteringFromBottom(false);
          } else if (activeSection === 0) {
            // We're at the first section scrolling up, exit to the top
            setHasReachedTop(true);
            document.body.style.overflow = 'auto';
            console.log("Exiting scroll-jack to the top");
          }
        }
        
        // Reset entering states after using them
        if (!isEnteringFromBottom && !isEnteringFromTop) {
          setIsEnteringFromTop(false);
          setIsEnteringFromBottom(false);
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
    
    // Add window scroll listener for detecting re-entry
    window.addEventListener('scroll', handleWindowScroll);
    
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [activeSection, isScrolling, sectionCount, hasReachedEnd, hasReachedTop, isEnteringFromBottom, isEnteringFromTop]);

  // Set initial body style
  useEffect(() => {
    document.body.style.overflow = hasReachedEnd || hasReachedTop ? 'auto' : 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [hasReachedEnd, hasReachedTop]);

  return {
    containerRef,
    activeSection,
    previousSection,
    animationDirection,
    sectionCount,
    sectionTitles,
    hasReachedEnd,
    hasReachedTop,
    setActiveSection,
    setPreviousSection,
    setAnimationDirection,
    setHasReachedEnd,
    setHasReachedTop,
    isEnteringFromBottom,
    isEnteringFromTop
  };
};
