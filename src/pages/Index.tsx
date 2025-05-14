
import ChladniPattern from "@/components/ChladniPattern";
import ScrollJackContainer from "@/components/ScrollJackContainer";

const Index = () => {
  return (
    <ChladniPattern>
      <div className="flex flex-col">
        {/* Normal content before the scroll jack container */}
        <div className="min-h-screen flex items-center justify-center bg-blue-900">
          <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">Scroll Down</h2>
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
              This is normal content before the scroll-jacking begins.
              Continue scrolling to experience the effect.
            </p>
          </div>
        </div>
        
        {/* ScrollJackContainer integrated in the middle of the page */}
        <ScrollJackContainer
          titles={["Innovative Scrolling", "Seamless Transitions", "Interactive Navigation"]}
        >
          {/* Section 1 */}
          <section className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
            <div className="text-center w-full mt-24">
              <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
                <li>• Discover innovative scroll animations</li>
                <li>• Experience seamless section transitions</li>
                <li>• Explore interactive visual elements</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
            <div className="text-center w-full mt-24">
              <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
                <li>• Titles remain fixed while content scrolls</li>
                <li>• Animated transitions between sections</li>
                <li>• Customizable scroll behavior</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
            <div className="text-center w-full mt-24">
              <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
                <li>• Interactive navigation dots</li>
                <li>• Responsive design for all devices</li>
                <li>• Smooth animation performance</li>
              </ul>
            </div>
          </section>
        </ScrollJackContainer>
        
        {/* Normal content after the scroll-jacking */}
        <div className="bg-purple-900 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">Continue Scrolling</h2>
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
              After the scroll-jacked sections, normal scrolling takes over again.
              The component can be placed anywhere in your page layout.
            </p>
          </div>
        </div>
      </div>
    </ChladniPattern>
  );
};

export default Index;
