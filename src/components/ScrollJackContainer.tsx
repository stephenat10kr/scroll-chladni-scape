
import React, { useEffect, useRef, useState } from 'react';

interface ScrollJackContainerProps {
  children: React.ReactNode;
}

const ScrollJackContainer: React.FC<ScrollJackContainerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [previousSection, setPreviousSection] = useState<number | null>(null);
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down'>('up');
  const childrenArray = React.Children.toArray(children);
  const sectionCount = childrenArray.length;
  
  // Add scroll sensitivity threshold
  const scrollThreshold = 50; // Higher value = less sensitive
  const scrollAccumulator = useRef(0);
  
  // Extract titles from each section for the fixed title
  const sectionTitles = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Find the h1 element within each section's first div
      const childrenElements = React.Children.toArray(child.props.children);
      
      for (const element of childrenElements) {
        if (React.isValidElement(element) && element.props && element.props.children) {
          // Look for the heading inside the div
          const headingElements = React.Children.toArray(element.props.children);
          for (const headingElement of headingElements) {
            if (React.isValidElement(headingElement) && 
                headingElement.type === 'h1') {
              return headingElement.props.children;
            }
          }
        }
      }
    }
    return "Section";
  });
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
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
        
        setActiveSection(newSection);
        
        // Reset accumulator after action is triggered
        scrollAccumulator.current = 0;
        
        // Add delay before allowing another scroll
        setTimeout(() => {
          setIsScrolling(false);
        }, 700); // Adjust timing as needed
      }
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
      {/* Fixed title area with animations - moved 200px down */}
      <div className="absolute top-0 left-0 w-full z-30 pt-[200px] pb-0 overflow-hidden">
        <div className="text-center relative h-16">
          {/* Title animations */}
          {sectionTitles.map((title, index) => {
            const isActive = index === activeSection;
            const wasActive = index === previousSection;
            
            let titleClass = "text-5xl md:text-7xl font-bold mb-0 text-white absolute w-full left-0 transition-all duration-700 opacity-0";
            
            if (isActive) {
              titleClass += " opacity-100 translate-y-0";
            } else if (wasActive && animationDirection === 'up') {
              titleClass += " -translate-y-20";
            } else if (wasActive && animationDirection === 'down') {
              titleClass += " translate-y-20";
            } else if (index > activeSection) {
              titleClass += " translate-y-20";
            } else if (index < activeSection) {
              titleClass += " -translate-y-20";
            }
            
            return (
              <h1 
                key={`title-${index}`} 
                className={titleClass}
              >
                {title}
              </h1>
            );
          })}
        </div>
      </div>
      
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          // Clone the section, but modify its content to hide the original title
          return (
            <div
              className="absolute top-0 left-0 w-full h-full transition-transform duration-700"
              style={{
                transform: `translateY(${(index - activeSection) * 100}%)`,
                zIndex: index === activeSection ? 10 : 0,
              }}
            >
              {React.cloneElement(child, {
                ...child.props,
                className: `${child.props.className || ''} pt-20`, // Reduced padding-top
                children: React.Children.map(child.props.children, (sectionChild) => {
                  if (!React.isValidElement(sectionChild)) {
                    return sectionChild;
                  }
                  
                  // Find and hide the original title in the content
                  if (React.isValidElement(sectionChild) && sectionChild.props) {
                    // Safely check if children exists in props
                    const childProps = sectionChild.props as any; // Using 'any' type to fix the TS error
                    if ('children' in childProps) {
                      const childrenElements = React.Children.toArray(childProps.children);
                      const filteredChildren = childrenElements.filter(element => {
                        return !(React.isValidElement(element) && element.type === 'h1');
                      });
                      
                      if (filteredChildren.length > 0) {
                        return React.cloneElement(
                          sectionChild as React.ReactElement, 
                          { 
                            ...childProps,  
                            children: filteredChildren 
                          } 
                        );
                      }
                    }
                  }
                  return sectionChild;
                })
              })}
            </div>
          );
        }
        return child;
      })}
      
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-2">
        {Array.from({ length: sectionCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setPreviousSection(activeSection);
              setAnimationDirection(index > activeSection ? 'up' : 'down');
              setActiveSection(index);
            }}
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
