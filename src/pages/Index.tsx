
import ChladniPattern from "@/components/ChladniPattern";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <ChladniPattern>
      {/* Hero Section */}
      <section className="container mx-auto py-28 px-4 min-h-[100vh] flex flex-col justify-center">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">Scroll Chladni Scape</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-white mb-8">
            A reactive Chladni pattern that morphs as you scroll down the page.
            The shader creates beautiful mathematical patterns that respond to your interaction.
          </p>
          <Link to="/example">
            <Button 
              variant="outline" 
              className="bg-white/20 text-white border-white/40 hover:bg-white/30"
            >
              View Example Implementation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-28 px-4 min-h-[100vh] bg-black/20 backdrop-blur-sm">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Visualization Features</h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/80">
            Discover the mathematical beauty of Chladni patterns and how they transform through interaction.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Mathematical Precision",
              description: "Based on Chladni's work with vibrational modes and standing waves, creating visually stunning patterns."
            },
            {
              title: "Reactive Scrolling",
              description: "The pattern morphs and transforms as you scroll through the page, creating a dynamic visual experience."
            },
            {
              title: "Customizable Parameters",
              description: "Easily integrate and customize the pattern for your own projects with adjustable parameters."
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/15 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-white">
                {feature.title}
              </h3>
              <p className="text-white/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Implementation Section */}
      <section className="container mx-auto py-28 px-4 min-h-[100vh]">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Get Started</h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/80 mb-8">
            Implementing the Chladni pattern in your own project is simple with our ready-to-use component.
          </p>
          <Link to="/example">
            <Button 
              variant="outline" 
              className="bg-white/20 text-white border-white/40 hover:bg-white/30"
            >
              View Implementation Example
            </Button>
          </Link>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4 text-white">Implementation Steps</h3>
          <ol className="space-y-4 text-white/80 list-decimal pl-5">
            <li>Copy the <code className="bg-black/30 px-2 py-1 rounded">ExportableChladniPattern.tsx</code> component to your project</li>
            <li>Import it into your page or component</li>
            <li>Wrap your content with the component to add the Chladni pattern background</li>
            <li>Customize parameters as needed for your specific design</li>
          </ol>
          <p className="mt-6 text-white">
            For detailed instructions, check out the example implementation and review the documentation.
          </p>
        </div>
      </section>
    </ChladniPattern>
  );
};

export default Index;
