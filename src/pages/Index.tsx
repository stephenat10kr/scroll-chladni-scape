
import ChladniPattern from "@/components/ChladniPattern";
import ScrollJackContainer from "@/components/ScrollJackContainer";

const Index = () => {
  return (
    <ChladniPattern>
      <div className="flex flex-col">
        {/* First ScrollJackContainer */}
        <ScrollJackContainer>
          {/* Section 1 */}
          <section className="container mx-auto px-4 min-h-screen flex flex-col justify-center">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">Section 1</h1>
              <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
                <li>• Discover innovative scroll animations</li>
                <li>• Experience seamless section transitions</li>
                <li>• Explore interactive visual elements</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="container mx-auto px-4 min-h-screen flex flex-col justify-center">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">Section 2</h1>
              <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
                <li>• Titles remain fixed while content scrolls</li>
                <li>• Animated transitions between sections</li>
                <li>• Customizable scroll behavior</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="container mx-auto px-4 min-h-screen flex flex-col justify-center">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">Section 3</h1>
              <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
                <li>• Interactive navigation dots</li>
                <li>• Responsive design for all devices</li>
                <li>• Smooth animation performance</li>
              </ul>
            </div>
          </section>
        </ScrollJackContainer>
        
        {/* Second ScrollJackContainer */}
        <ScrollJackContainer>
          {/* Section 4 */}
          <section className="container mx-auto px-4 min-h-screen flex flex-col justify-center">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">Section 4</h1>
              <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
                <li>• Additional features displayed here</li>
                <li>• Second scrolljack container starts</li>
                <li>• Independent scroll navigation</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="container mx-auto px-4 min-h-screen flex flex-col justify-center">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">Section 5</h1>
              <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
                <li>• Continue the journey with more content</li>
                <li>• Each container has its own navigation</li>
                <li>• Seamless transition between containers</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="container mx-auto px-4 min-h-screen flex flex-col justify-center">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">Section 6</h1>
              <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
                <li>• Complete the experience</li>
                <li>• Final section of the showcase</li>
                <li>• Continue scrolling for more content</li>
              </ul>
            </div>
          </section>
        </ScrollJackContainer>
      </div>
    </ChladniPattern>
  );
};

export default Index;
