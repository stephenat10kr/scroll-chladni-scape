
import React, { useState, useEffect, useRef } from "react";
import FullpageScrollJack from "@/components/FullpageScrollJack";
import ScrollableBanner from "@/components/ScrollableBanner";

const Index = () => {
  const [scrollJackActive, setScrollJackActive] = useState(false);
  const scrollJackRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  
  // Listen for scroll events to determine when to activate scrolljacking
  useEffect(() => {
    const handleScroll = () => {
      if (bannerRef.current && scrollJackRef.current) {
        const bannerBottom = bannerRef.current.getBoundingClientRect().bottom;
        
        // If banner is scrolled past (its bottom edge is above viewport top), activate scrolljacking
        if (bannerBottom <= 0 && !scrollJackActive) {
          setScrollJackActive(true);
          document.body.style.overflow = 'hidden'; // Lock scrolling
        } 
        // If banner is visible again, deactivate scrolljacking
        else if (bannerBottom > 0 && scrollJackActive) {
          setScrollJackActive(false);
          document.body.style.overflow = 'auto'; // Allow scrolling
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollJackActive]);

  // Return to normal scrolling when all scrolljack sections are completed
  const handleScrollJackComplete = () => {
    document.body.style.overflow = 'auto';
  };

  // Define the content for each section
  const sections = [
    // Section 1
    <div className="text-center w-full mt-24" key="section-1">
      <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
        <li>• Discover innovative scroll animations</li>
        <li>• Experience seamless section transitions</li>
        <li>• Explore interactive visual elements</li>
      </ul>
    </div>,
    
    // Section 2
    <div className="text-center w-full mt-24" key="section-2">
      <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
        <li>• Titles remain fixed while content scrolls</li>
        <li>• Animated transitions between sections</li>
        <li>• Customizable scroll behavior</li>
      </ul>
    </div>,
    
    // Section 3
    <div className="text-center w-full mt-24" key="section-3">
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

  return (
    <div>
      {/* Normal scrolling banner */}
      <div ref={bannerRef}>
        <ScrollableBanner />
      </div>
      
      {/* ScrollJack sections that become active after scrolling past the banner */}
      <div 
        ref={scrollJackRef} 
        style={{ 
          visibility: scrollJackActive ? 'visible' : 'hidden',
          position: scrollJackActive ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 10
        }}
      >
        <FullpageScrollJack 
          sections={sections}
          titles={titles}
          afterContent={afterContent}
          background="chladni"
        />
      </div>
      
      {/* Placeholder to maintain document height when scrolljack becomes fixed */}
      {scrollJackActive && (
        <div style={{ 
          height: `${sections.length}00vh`, 
          visibility: 'hidden' 
        }} />
      )}
      
      {/* Display afterContent at the bottom when not in scrolljack mode */}
      {!scrollJackActive && afterContent}
    </div>
  );
};

export default Index;
