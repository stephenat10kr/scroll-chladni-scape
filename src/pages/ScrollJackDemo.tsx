
import React from 'react';
import { ScrollJackContainer } from '@/components/scroll-jack';

const ScrollJackDemo: React.FC = () => {
  return (
    <div className="flex flex-col bg-gray-900">
      {/* Normal content before the scroll jack container */}
      <div className="min-h-screen flex items-center justify-center bg-purple-900">
        <div className="text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">Imported Demo</h2>
          <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
            This demonstrates importing and using the ScrollJackContainer component. 
            Scroll down to experience the effect.
          </p>
        </div>
      </div>
      
      {/* Imported ScrollJackContainer */}
      <ScrollJackContainer
        titles={["Component Import", "Easy Integration", "Custom Sections"]}
      >
        {/* Section 1 */}
        <section className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
          <div className="text-center w-full mt-24">
            <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-4">
              <li>• Import the component from your project</li>
              <li>• Use it anywhere in your layout</li>
              <li>• Customize section content</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
          <div className="text-center w-full mt-24">
            <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-4">
              <li>• Works with your existing layout</li>
              <li>• Respects normal scrolling before/after</li>
              <li>• Easy to maintain and update</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
          <div className="text-center w-full mt-24">
            <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-4">
              <li>• Add as many sections as needed</li>
              <li>• Customize titles and content</li>
              <li>• Responsive across all devices</li>
            </ul>
          </div>
        </section>
      </ScrollJackContainer>
      
      {/* Normal content after the scroll jack container */}
      <div className="min-h-screen flex items-center justify-center bg-teal-900">
        <div className="text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">Continue Scrolling</h2>
          <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
            After the scroll-jacked sections, normal scrolling takes over again.
            The component can be imported and used in any project.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScrollJackDemo;
