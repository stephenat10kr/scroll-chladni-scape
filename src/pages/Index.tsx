
import React from "react";
import ChladniScrollSection from "@/components/ChladniScrollSection";

const Index = () => {
  // Data for the scrolljacking sections
  const scrollSections = [
    {
      title: "Section 1",
      listItems: [
        "Discover innovative scroll animations",
        "Experience seamless section transitions",
        "Explore interactive visual elements",
      ],
    },
    {
      title: "Section 2",
      listItems: [
        "Titles remain fixed while content scrolls",
        "Animated transitions between sections",
        "Customizable scroll behavior",
      ],
    },
    {
      title: "Section 3",
      listItems: [
        "Interactive navigation dots",
        "Responsive design for all devices",
        "Smooth animation performance",
      ],
    },
  ];

  return (
    <div className="scroll-smooth">
      {/* Top normal-scrolling section with red background */}
      <section className="min-h-screen bg-red-600 flex flex-col justify-center items-center px-4">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Welcome Section
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-white">
            Scroll down to experience the interactive Chladni pattern with scroll-jacking.
            This section uses normal scrolling behavior.
          </p>
        </div>
      </section>

      {/* Scrolljacking Chladni Pattern Section */}
      <ChladniScrollSection sections={scrollSections} />

      {/* Bottom normal-scrolling section with red background */}
      <section className="min-h-screen bg-red-600 flex flex-col justify-center items-center px-4">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Final Section
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-white">
            You've completed the scrolljacking experience.
            This section returns to normal scrolling behavior.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
