
import React from 'react';
import SectionTitle from './SectionTitle';
import ScrollSection from './ScrollSection';
import NavigationDots from './NavigationDots';
import { useScrollJack } from './useScrollJack';

interface ScrollJackContainerProps {
  children: React.ReactNode;
}

const ScrollJackContainer: React.FC<ScrollJackContainerProps> = ({ children }) => {
  const childrenArray = React.Children.toArray(children);
  const sectionCount = childrenArray.length;
  
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
  
  const {
    containerRef,
    activeSection,
    previousSection,
    animationDirection,
    allSectionsViewed,
    handleSectionChange
  } = useScrollJack(sectionCount);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative h-screen ${allSectionsViewed ? "" : "overflow-hidden"}`}
      style={{
        // Add a distinct boundary for the scrolljack container
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always'
      }}
    >
      {/* Fixed title area with animations */}
      <SectionTitle 
        sectionTitles={sectionTitles}
        activeSection={activeSection}
        previousSection={previousSection}
        animationDirection={animationDirection}
        allSectionsViewed={allSectionsViewed}
      />
      
      {/* Scrollable sections */}
      {React.Children.map(children, (child, index) => (
        <ScrollSection
          child={child}
          index={index}
          activeSection={activeSection}
          allSectionsViewed={allSectionsViewed}
        />
      ))}
      
      {/* Navigation dots */}
      <NavigationDots 
        sectionCount={sectionCount}
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        allSectionsViewed={allSectionsViewed}
      />
    </div>
  );
};

export default ScrollJackContainer;
