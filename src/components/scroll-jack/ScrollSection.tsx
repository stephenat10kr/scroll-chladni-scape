
import React from 'react';

interface ScrollSectionProps {
  child: React.ReactNode;
  index: number;
  activeSection: number;
  allSectionsViewed: boolean;
}

const ScrollSection: React.FC<ScrollSectionProps> = ({
  child,
  index,
  activeSection,
  allSectionsViewed
}) => {
  // Ensure child is a valid React element before proceeding
  if (!React.isValidElement(child)) {
    return null;
  }

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full transition-transform duration-700 ${allSectionsViewed ? "static h-screen" : ""}`}
      style={{
        transform: allSectionsViewed ? 'none' : `translateY(${(index - activeSection) * 100}%)`,
        zIndex: index === activeSection ? 10 : 0,
      }}
    >
      {React.cloneElement(child as React.ReactElement<any>, {
        ...child.props,
        className: `${child.props.className || ''} pt-20`, // Reduced padding-top
        children: React.Children.map(child.props.children, (sectionChild) => {
          if (!React.isValidElement(sectionChild)) {
            return sectionChild;
          }
          
          // Find and hide the original title in the content
          if (React.isValidElement(sectionChild) && sectionChild.props) {
            // Safely check if children exists in props
            const childProps = sectionChild.props as Record<string, any>;
            if ('children' in childProps) {
              const childrenElements = React.Children.toArray(childProps.children);
              const filteredChildren = childrenElements.filter(element => {
                return !(React.isValidElement(element) && element.type === 'h1');
              });
              
              if (filteredChildren.length > 0) {
                return React.cloneElement(
                  sectionChild as React.ReactElement<any>, 
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
};

export default ScrollSection;
