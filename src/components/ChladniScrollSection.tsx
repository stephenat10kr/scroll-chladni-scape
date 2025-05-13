
import React from "react";
import ChladniPattern from "@/components/ChladniPattern";
import ScrollJackContainer from "@/components/ScrollJackContainer";

interface ChladniScrollSectionProps {
  sections: {
    title: string;
    listItems: string[];
  }[];
}

const ChladniScrollSection: React.FC<ChladniScrollSectionProps> = ({ sections }) => {
  return (
    <ChladniPattern>
      <ScrollJackContainer>
        {sections.map((section, index) => (
          <section key={index} className="container mx-auto px-4 min-h-screen flex flex-col justify-center">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">{section.title}</h1>
              <ul className="text-xl md:text-2xl max-w-2xl mx-auto text-white space-y-2">
                {section.listItems.map((item, itemIndex) => (
                  <li key={itemIndex}>• {item}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </ScrollJackContainer>
    </ChladniPattern>
  );
};

export default ChladniScrollSection;
