
import React, { useState, useEffect, useRef } from "react";
import FullpageScrollJack from "@/components/FullpageScrollJack";
import ScrollableBanner from "@/components/ScrollableBanner";

const Index = () => {
  const [scrollJackActive, setScrollJackActive] = useState(false);
  const [scrollJackComplete, setScrollJackComplete] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  
  // Function to handle when all scrolljack sections are complete
  const handleScrollJackComplete = () => {
    console.log("Scrolljack complete!");
    setScrollJackComplete(true);
    document.body.style.overflow = 'auto';
    
    // After scrolljack is complete, scroll to the red section
    window.scrollTo({
      top: window.innerHeight * (sections.length + 1),
      behavior: 'auto'
    });
  };

  // Function to reset when we need to reactivate scrolljack
  const reactivateScrollJack = () => {
    console.log("Reactivating scrolljack");
    setScrollJackComplete(false);
    setScrollJackActive(true);
    document.body.style.overflow = 'hidden';
  };

  // Monitor scroll position to activate/deactivate scroll-jacking
  useEffect(() => {
    const checkScroll = () => {
      if (bannerRef.current) {
        const bannerBottom = bannerRef.current.getBoundingClientRect().bottom;
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // If user has scrolled past banner, activate scrolljacking
        if (bannerBottom <= 0 && !scrollJackActive && !scrollJackComplete) {
          console.log("Activating scrolljack - scrolled past banner");
          setScrollJackActive(true);
          document.body.style.overflow = 'hidden';
        } 
        // If user has scrolled back to see the banner, deactivate scrolljacking
        else if (bannerBottom > 0 && scrollJackActive) {
          console.log("Deactivating scrolljack - banner visible again");
          setScrollJackActive(false);
          document.body.style.overflow = 'auto';
        }
        
        // Check if user is scrolling up from the red section to re-enter scrolljack
        if (scrollJackComplete) {
          // Calculate the position where the red section begins
          const redSectionTop = windowHeight * (sections.length + 1);
          
          // If scrolled up from red section but still below the scrolljack area
          if (scrollY < redSectionTop && scrollY > windowHeight) {
            console.log("Re-entering scrolljack from below");
            reactivateScrollJack();
            // Set the active section to the last one when coming from the bottom
            const scrollJackContainer = document.querySelector('[data-scrolljack="true"]');
            if (scrollJackContainer) {
              // Dispatch a custom event to set the active section to the last one
              const event = new CustomEvent('set-active-section', { detail: { section: sections.length - 1 } });
              scrollJackContainer.dispatchEvent(event);
            }
          }
        }
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
  }, [scrollJackActive, scrollJackComplete]);

  // Reset scrolljack when going back to top
  useEffect(() => {
    const handleScrollTop = () => {
      if (window.scrollY === 0 && scrollJackComplete) {
        console.log("Resetting scrolljack state");
        setScrollJackComplete(false);
      }
    };
    
    window.addEventListener('scroll', handleScrollTop);
    return () => window.removeEventListener('scroll', handleScrollTop);
  }, [scrollJackComplete]);

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

  // Define content that appears after scrolljacking
  const afterContent = (
    <div className="bg-[#ea384c] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">Red Box Content</h2>
        <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
          This content appears after scrolling past all the scroll-jacked sections. Normal scrolling takes over here.
        </p>
      </div>
    </div>
  );

  // Calculate height for placeholder div based on number of sections
  const placeholderHeight = sections.length * 100;

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
          />
        )}
      </div>
      
      {/* Placeholder div to maintain scroll height */}
      {(scrollJackActive || scrollJackComplete) && (
        <div 
          style={{ 
            height: `${placeholderHeight}vh`, 
            pointerEvents: 'none' 
          }} 
        />
      )}
      
      {/* After content appears when scrolljack is complete */}
      {afterContent}
    </div>
  );
};

export default Index;
