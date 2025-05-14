
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
                headingElement.type === 'h1') {
              return headingElement.props.children;
            }
          }
        }
      }
    }
    return "Section";
  });
};

// Create modified section component with proper vertical centering
export const createModifiedSection = (
  child: React.ReactElement, 
  index: number, 
  activeSection: number, 
  hasReachedEnd: boolean, 
  sectionCount: number
) => {
  const isLastSection = index === sectionCount - 1;
  
  // Debug log for visibility issues
  console.log("Creating section:", index, "activeSection:", activeSection, "transform:", `translateY(${(index - activeSection) * 100}%)`, "opacity:", 1);
  
  return (
    <div
      className="absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out flex items-center justify-center"
      style={{
        transform: `translateY(${(index - activeSection) * 100}%)`,
        zIndex: index === activeSection ? 10 : 5,
        opacity: 1, // Make sure opacity is 1 to be visible
        pointerEvents: hasReachedEnd && !isLastSection ? 'none' : 'auto'
      }}
    >
      {React.cloneElement(child, {
        ...child.props,
        className: `${child.props.className || ''} flex items-center justify-center h-full w-full`,
      })}
    </div>
  );
};
