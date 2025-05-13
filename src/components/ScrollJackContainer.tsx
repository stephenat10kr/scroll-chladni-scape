
import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from './ui/scroll-area';

interface ScrollJackContainerProps {
  children: React.ReactNode;
}

const ScrollJackContainer: React.FC<ScrollJackContainerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const childrenArray = React.Children.toArray(children);
  const sectionCount = childrenArray.length;
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrolling) return;
      
      setIsScrolling(true);
      
      // Determine scroll direction
      const direction = e.deltaY > 0 ? 1 : -1;
      
      // Calculate new active section
      const newSection = Math.min(
        Math.max(0, activeSection + direction),
        sectionCount - 1
      );
      
      setActiveSection(newSection);
      
      // Add delay before allowing another scroll
      setTimeout(() => {
        setIsScrolling(false);
      }, 700); // Adjust timing as needed
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [activeSection, isScrolling, sectionCount]);
  
  return (
    <div ref={containerRef} className="h-screen overflow-hidden relative">
      {React.Children.map(children, (child, index) => (
        <div
          className="absolute top-0 left-0 w-full h-full transition-transform duration-700"
          style={{
            transform: `translateY(${(index - activeSection) * 100}%)`,
            zIndex: index === activeSection ? 10 : 0,
          }}
        >
          {child}
        </div>
      ))}
      
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-2">
        {Array.from({ length: sectionCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSection(index)}
            className={`w-3 h-3 rounded-full ${
              index === activeSection ? 'bg-white' : 'bg-gray-500'
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollJackContainer;
