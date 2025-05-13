
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
            <div className="text-center w-full">
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
            <div className="text-center w-full">
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
            <div className="text-center w-full">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">Section 3</h1>
              <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
                <li>• Interactive navigation dots</li>
                <li>• Responsive design for all devices</li>
                <li>• Smooth animation performance</li>
              </ul>
            </div>
          </section>
        </ScrollJackContainer>
        
        {/* Red box content with clear separation from scrolljack container */}
        <div className="bg-[#ea384c] min-h-screen flex items-center justify-center mt-0">
          <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">Red Box Content</h2>
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
              This red box replaces the second ScrollJackContainer component. You can add any content here that you'd like to display in this section.
            </p>
          </div>
        </div>
      </div>
    </ChladniPattern>
  );
};

export default Index;
