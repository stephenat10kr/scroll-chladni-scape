
import FullpageScrollJack from "@/components/FullpageScrollJack";

const Index = () => {
  // Define the content for each section
  const sections = [
    // Section 1
    <div className="text-center w-full mt-24" key="section-1">
      <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
        <li>• Discover innovative scroll animations</li>
        <li>• Experience seamless section transitions</li>
        <li>• Explore interactive visual elements</li>
      </ul>
    </div>,
    
    // Section 2
    <div className="text-center w-full mt-24" key="section-2">
      <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
        <li>• Titles remain fixed while content scrolls</li>
        <li>• Animated transitions between sections</li>
        <li>• Customizable scroll behavior</li>
      </ul>
    </div>,
    
    // Section 3
    <div className="text-center w-full mt-24" key="section-3">
      <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
        <li>• Interactive navigation dots</li>
        <li>• Responsive design for all devices</li>
        <li>• Smooth animation performance</li>
      </ul>
    </div>
  ];

  // Define section titles
  const titles = ["Section 1", "Section 2", "Section 3"];

  // Define content that appears after scrolljacking
  const afterContent = (
    <div className="bg-[#ea384c] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">Red Box Content</h2>
        <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto">
          This content appears after scrolling past all the scroll-jacked sections. Normal scrolling takes over here.
        </p>
      </div>
    </div>
  );

  return (
    <FullpageScrollJack 
      sections={sections}
      titles={titles}
      afterContent={afterContent}
      background="chladni"
    />
  );
};

export default Index;
