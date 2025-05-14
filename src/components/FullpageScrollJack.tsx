
import React, { useEffect } from 'react';
import ChladniPattern from "@/components/ChladniPattern";
import ScrollJackContainer from "@/components/ScrollJackContainer";
import { useScrollJack } from "@/components/scroll-jack/use-scroll-jack";

interface FullpageScrollJackProps {
  sections: React.ReactNode[];
  titles: string[];
  afterContent?: React.ReactNode;
  background?: 'chladni' | 'none';
  onComplete?: () => void; // Add callback for when scrolljacking is complete
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
 */
const FullpageScrollJack: React.FC<FullpageScrollJackProps> = ({ 
  sections, 
  titles, 
  afterContent,
  background = 'chladni',
  onComplete
}) => {
  const Content = () => {
    const { hasReachedEnd } = useScrollJack(sections);
    
    useEffect(() => {
      if (hasReachedEnd && onComplete) {
        onComplete();
      }
    }, [hasReachedEnd]);
    
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
