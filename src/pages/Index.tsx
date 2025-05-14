import React, { useState, useEffect, useRef } from "react";
import FullpageScrollJack from "@/components/FullpageScrollJack";
import ScrollableBanner from "@/components/ScrollableBanner";

const Index = () => {
  const [scrollJackActive, setScrollJackActive] = useState(false);
  const [scrollJackComplete, setScrollJackComplete] = useState(false);
  const [scrollJackExitedTop, setScrollJackExitedTop] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const redSectionRef = useRef<HTMLDivElement>(null);
  
  // Define the content for each scrolljack section
  const sections = [
    // Section 1
    <div className="text-center w-full mt-24" key="section-1">
      <h1 className="text-3xl font-bold mb-6 text-white">Section 1</h1>
      <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
        <li>• Discover innovative scroll animations</li>
        <li>• Experience seamless section transitions</li>
        <li>• Explore interactive visual elements</li>
      </ul>
    </div>,
    
    // Section 2
    <div className="text-center w-full mt-24" key="section-2">
      <h1 className="text-3xl font-bold mb-6 text-white">Section 2</h1>
      <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
        <li>• Titles remain fixed while content scrolls</li>
        <li>• Animated transitions between sections</li>
        <li>• Customizable scroll behavior</li>
      </ul>
    </div>,
    
    // Section 3
    <div className="text-center w-full mt-24" key="section-3">
      <h1 className="text-3xl font-bold mb-6 text-white">Section 3</h1>
      <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
        <li>• Interactive navigation dots</li>
        <li>• Responsive design for all devices</li>
        <li>• Smooth animation performance</li>
      </ul>
    </div>
  ];

  // Define section titles
  const titles = ["Section 1", "Section 2", "Section 3"];

  // Function to handle when all scrolljack sections are complete (scrolled to bottom)
  const handleScrollJackComplete = () => {
    console.log("Scrolljack complete! (Scrolled to end)");
    setScrollJackComplete(true);
    setScrollJackExitedTop(false);
    document.body.style.overflow = 'auto';
    
    // After scrolljack is complete, scroll to the red section without resetting position
    setTimeout(() => {
      // Don't use scrollIntoView here as it can cause jumps
      // Just ensure the red section is visible by leaving the scroll position alone
      console.log("Allowing natural scrolling to red section");
    }, 50);
  };

  // Function to handle when scrolljack exits from the top
  const handleScrollJackExitTop = () => {
    console.log("Scrolljack exited from top");
    setScrollJackExitedTop(true);
    setScrollJackComplete(false);
    document.body.style.overflow = 'auto';
    
    // Scroll back to banner
    if (bannerRef.current) {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'auto'
        });
        console.log("Auto-scrolled to top banner");
      }, 50);
    }
  };

  // Function to activate/reactivate scrolljack
  const activateScrollJack = (fromBelow = false, fromAbove = false) => {
    console.log(`Activating scrolljack${fromBelow ? ' from below' : ''}${fromAbove ? ' from above' : ''}`);
    setScrollJackActive(true);
    setScrollJackComplete(false);
    setScrollJackExitedTop(false);
    
    // Keep the current scroll position if entering from below
    if (!fromBelow) {
      document.body.style.overflow = 'hidden';
    }
    
    // If scrolljack is activated from below, set the active section to the last one
    const scrollJackContainer = document.querySelector('[data-scrolljack="true"]');
    if (scrollJackContainer && (fromBelow || fromAbove)) {
      // Dispatch a custom event to set the active section
      const sectionIndex = fromBelow ? sections.length - 1 : 0;
      const event = new CustomEvent('set-active-section', { 
        detail: { 
          section: sectionIndex,
          fromBelow: fromBelow,
          fromAbove: fromAbove
        } 
      });
      scrollJackContainer.dispatchEvent(event);
    }
  };

  // Monitor scroll position to activate/deactivate scroll-jacking
  useEffect(() => {
    const checkScroll = () => {
      if (!bannerRef.current || !redSectionRef.current) return;
      
      const bannerRect = bannerRef.current.getBoundingClientRect();
      const redSectionRect = redSectionRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate positions
      const bannerBottom = bannerRect.bottom;
      const redSectionTop = redSectionRect.top;
      
      // If user has scrolled past banner but not yet into the red section, activate scrolljacking
      if (bannerBottom <= 0 && !scrollJackActive && !scrollJackComplete && !scrollJackExitedTop) {
        console.log("Activating scrolljack - scrolled past banner");
        activateScrollJack(false, true);
      } 
      // If user has scrolled back to see the banner while in scrolljack mode
      else if (bannerBottom > 0 && scrollJackActive) {
        console.log("Deactivating scrolljack - banner visible again");
        setScrollJackActive(false);
        document.body.style.overflow = 'auto';
      }
      
      // Check if user is scrolling up from the red section to re-enter scrolljack
      if (scrollJackComplete && redSectionTop > windowHeight / 2) {
        console.log("Re-entering scrolljack from below");
        activateScrollJack(true, false);
      }
      
      // Check if user is scrolling down from banner area to re-enter scrolljack after exiting top
      if (scrollJackExitedTop && bannerBottom < -windowHeight / 4) {
        console.log("Re-entering scrolljack from above");
        activateScrollJack(false, true);
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', checkScroll);
    
    // Initial check
    checkScroll();
    
    return () => {
      window.removeEventListener('scroll', checkScroll);
      document.body.style.overflow = 'auto';
    };
  }, [scrollJackActive, scrollJackComplete, scrollJackExitedTop]);

  // Calculate height for placeholder div based on number of sections
  // Increased placeholder height to ensure there's enough scroll room
  const placeholderHeight = sections.length * 120;

  return (
    <div className="relative">
      {/* Normal scrolling banner */}
      <div ref={bannerRef}>
        <ScrollableBanner height="100vh" />
      </div>
      
      {/* ScrollJack sections that activate after scrolling past the banner */}
      <div 
        style={{ 
          position: scrollJackActive ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: 10,
          visibility: scrollJackActive ? 'visible' : 'hidden',
          pointerEvents: scrollJackActive ? 'auto' : 'none'
        }}
        data-scrolljack="true"
      >
        {scrollJackActive && (
          <FullpageScrollJack 
            sections={sections}
            titles={titles}
            background="chladni"
            onComplete={handleScrollJackComplete}
            onExitTop={handleScrollJackExitTop}
          />
        )}
      </div>
      
      {/* Placeholder div to maintain scroll height */}
      {(scrollJackActive || scrollJackComplete || scrollJackExitedTop) && (
        <div 
          style={{ 
            height: `${placeholderHeight}vh`, 
            pointerEvents: 'none' 
          }} 
        />
      )}
      
      {/* After content appears when scrolljack is complete */}
      <div 
        ref={redSectionRef} 
        className="bg-[#ea384c] min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">Red Box Content</h2>
          <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
            This content appears after scrolling past all the scroll-jacked sections. Normal scrolling takes over here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
