
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
  
  // Extract section titles
  const sectionTitles = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Find the h1 element within each section
      const h1Element = React.Children.toArray(child.props.children).find((element) => 
        React.isValidElement(element) && 
        element.props && 
        element.props.className && 
        typeof element.props.className === 'string' &&
        element.props.className.includes('text-5xl')
      );
      
      if (h1Element && React.isValidElement(h1Element)) {
        return h1Element.props.children;
      }
    }
    return null;
  });
  
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
      {/* Fixed title container */}
      <div className="fixed top-0 left-0 w-full z-20 p-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white transition-opacity duration-500">
            {sectionTitles && sectionTitles[activeSection]}
          </h1>
        </div>
      </div>
      
      {/* Content sections */}
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          // Clone the child but filter out the h1 title
          const contentWithoutTitle = React.Children.toArray(child.props.children).filter((element) => {
            if (React.isValidElement(element)) {
              return !(
                element.props && 
                element.props.className && 
                typeof element.props.className === 'string' &&
                element.props.className.includes('text-5xl')
              );
            }
            return true;
          });
          
          const newContent = (
            <div className="text-center pt-32">
              {contentWithoutTitle}
            </div>
          );
          
          return (
            <div
              className="absolute top-0 left-0 w-full h-full transition-transform duration-700"
              style={{
                transform: `translateY(${(index - activeSection) * 100}%)`,
                zIndex: index === activeSection ? 10 : 0,
              }}
            >
              {React.cloneElement(child, {}, newContent)}
            </div>
          );
        }
        return child;
      })}
      
      {/* Navigation dots */}
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
