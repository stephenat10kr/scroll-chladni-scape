
import React from 'react';

// Extract titles from sections
export const extractSectionTitles = (children: React.ReactNode) => {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Find the h1 element within each section's first div
      const childrenElements = React.Children.toArray(child.props.children);
      
      for (const element of childrenElements) {
        if (React.isValidElement(element) && element.props && element.props.children) {
          // Look for the heading inside the div
          const headingElements = React.Children.toArray(element.props.children);
          for (const headingElement of headingElements) {
            if (React.isValidElement(headingElement) && 
                (headingElement.type === 'h1' || headingElement.type === 'h2')) {
              return headingElement.props.children;
            }
          }
        }
      }
    }
    return "Section";
  });
};

// Create modified section component with improved transitions
export const createModifiedSection = (
  child: React.ReactElement, 
  index: number, 
  activeSection: number, 
  hasReachedEnd: boolean, 
  sectionCount: number
) => {
  const isLastSection = index === sectionCount - 1;
  const isActive = index === activeSection;
  
  // Calculate distance from active section for more sophisticated transitions
  const distance = Math.abs(index - activeSection);
  
  return (
    <div
      className="absolute inset-0 w-full h-full flex items-center justify-center"
      style={{
        transform: `translateY(${(index - activeSection) * 100}%)`,
        zIndex: isActive ? 10 : 0,
        opacity: distance > 1 ? 0 : 1,
        transition: "transform 600ms cubic-bezier(0.33, 1, 0.68, 1), opacity 400ms ease-out",
        pointerEvents: (isActive || (hasReachedEnd && isLastSection)) ? 'auto' : 'none',
        willChange: "transform, opacity"
      }}
    >
      {React.cloneElement(child, {
        ...child.props,
        className: `${child.props.className || ''} flex items-center justify-center h-full w-full`,
      })}
    </div>
  );
};
