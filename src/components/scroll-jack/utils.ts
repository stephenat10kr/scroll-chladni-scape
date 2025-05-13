
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

// Create modified section component with hidden original title
export const createModifiedSection = (
  child: React.ReactElement, 
  index: number, 
  activeSection: number, 
  hasReachedEnd: boolean, 
  sectionCount: number
) => {
  return (
    <div
      className="absolute top-0 left-0 w-full h-full transition-transform duration-700 flex items-center justify-center"
      style={{
        transform: `translateY(${(index - activeSection) * 100}%)`,
        zIndex: index === activeSection ? 10 : 0,
        opacity: hasReachedEnd && index === sectionCount - 1 ? 0 : 1,
        pointerEvents: hasReachedEnd && index === sectionCount - 1 ? 'none' : 'auto',
      }}
    >
      {React.cloneElement(child, {
        ...child.props,
        className: `${child.props.className || ''} flex items-center justify-center h-full`,
        children: React.Children.map(child.props.children, (sectionChild) => {
          if (!React.isValidElement(sectionChild)) {
            return sectionChild;
          }
          
          // Type-safe approach for manipulating React elements with children
          if (React.isValidElement(sectionChild)) {
            const sectionChildProps = sectionChild.props as any;
            if (sectionChildProps && 'children' in sectionChildProps) {
              const childrenElements = React.Children.toArray(sectionChildProps.children);
              const filteredChildren = childrenElements.filter(element => {
                return !(React.isValidElement(element) && element.type === 'h1');
              });
              
              if (filteredChildren.length > 0) {
                return React.cloneElement(
                  sectionChild,
                  {
                    ...sectionChildProps,
                    className: `${sectionChildProps.className || ''} flex flex-col items-center justify-center h-full`,
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
};
