
import ChladniPattern from "@/components/ChladniPattern";

const Index = () => {
  return (
    <ChladniPattern>
      <div className="container mx-auto py-20 px-4 min-h-screen">
        <div className="text-center mb-40">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">Scroll Chladni Scape</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-white">
            A reactive Chladni pattern that morphs as you scroll down the page.
            The shader creates beautiful mathematical patterns that respond to your interaction.
          </p>
        </div>
        
        <div className="space-y-60">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="py-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Section {i + 1}
              </h2>
              <p className="text-lg md:text-xl mb-8 text-white">
                Keep scrolling to see how the background pattern transforms.
                These mathematical visualizations are based on Chladni's work
                with vibrational modes and standing waves.
              </p>
              <div className="h-20 w-full bg-white/10 rounded-lg"></div>
            </div>
          ))}
        </div>
        
        <div className="text-center py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Pattern Complete
          </h2>
          <p className="text-lg md:text-xl text-white">
            You've reached the end of the scroll experience.
            The pattern has now gone through its full transformation.
          </p>
        </div>
      </div>
    </ChladniPattern>
  );
};

export default Index;
