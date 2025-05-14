
import React, { useEffect } from 'react';
import ChladniPattern from "@/components/ChladniPattern";
import ScrollJackContainer from "@/components/ScrollJackContainer";
import { useScrollJack } from "./scroll-jack/use-scroll-jack";

interface FullpageScrollJackProps {
  sections: React.ReactNode[];
  titles: string[];
  afterContent?: React.ReactNode;
  background?: 'chladni' | 'none';
  onComplete?: () => void; // Callback for when scrolljacking is complete (reached end)
  onExitTop?: () => void;  // Callback for when scrolljacking exits from the top
}

/**
 * A component that provides a full-page scrolljacking experience with sections
 * that snap into place during scrolling.
 * 
 * @param sections - Array of React nodes to be displayed as full-height sections
 * @param titles - Array of titles corresponding to each section
 * @param afterContent - Optional content to display after all scrolljacked sections
 * @param background - Optional background type ('chladni' or 'none'), defaults to 'chladni'
 * @param onComplete - Optional callback for when scrolljacking is complete
 * @param onExitTop - Optional callback for when scrolljacking exits from the top
 */
const FullpageScrollJack: React.FC<FullpageScrollJackProps> = ({ 
  sections, 
  titles, 
  afterContent,
  background = 'chladni',
  onComplete,
  onExitTop
}) => {
  const Content = () => {
    const { containerRef, hasReachedEnd, hasReachedTop } = useScrollJack(sections);
    
    useEffect(() => {
      if (hasReachedEnd && onComplete) {
        onComplete();
      }
    }, [hasReachedEnd, onComplete]);
    
    useEffect(() => {
      if (hasReachedTop && onExitTop) {
        onExitTop();
      }
    }, [hasReachedTop, onExitTop]);
    
    useEffect(() => {
      // Listen for the custom event from useScrollJack
      const handleScrollJackComplete = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail && customEvent.detail.direction) {
          if (customEvent.detail.direction === 'down' && onComplete) {
            onComplete();
          } else if (customEvent.detail.direction === 'up' && onExitTop) {
            onExitTop();
          }
        }
      };
      
      if (containerRef.current) {
        containerRef.current.addEventListener('scroll-jack-complete', handleScrollJackComplete);
      }
      
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('scroll-jack-complete', handleScrollJackComplete);
        }
      };
    }, [onComplete, onExitTop]);
    
    return (
      <div className="flex flex-col">
        {/* ScrollJack Container */}
        <ScrollJackContainer titles={titles}>
          {sections.map((section, index) => (
            <section 
              key={`scroll-section-${index}`} 
              className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center"
            >
              {section}
            </section>
          ))}
        </ScrollJackContainer>
        
        {/* Content after scroll-jacking */}
        {afterContent && (
          <div className="min-h-screen">
            {afterContent}
          </div>
        )}
      </div>
    );
  };

  // Render with or without ChladniPattern background
  return background === 'chladni' ? (
    <ChladniPattern>
      <Content />
    </ChladniPattern>
  ) : (
    <Content />
  );
};

export default FullpageScrollJack;
