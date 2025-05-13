
import ChladniPattern from "@/components/ChladniPattern";
import ScrollJackContainer from "@/components/ScrollJackContainer";

const Index = () => {
  return (
    <ChladniPattern>
      <ScrollJackContainer>
        {/* Section 1 */}
        <section className="container mx-auto px-4 min-h-screen flex flex-col justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">Section 1</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-white">
              Scroll down to explore more content. This section demonstrates the fixed title effect.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="container mx-auto px-4 min-h-screen flex flex-col justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">Section 2</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-white">
              The title stays in position while the content scrolls underneath.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="container mx-auto px-4 min-h-screen flex flex-col justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">Section 3</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-white">
              Each section's title will appear in the fixed position as you scroll to it.
            </p>
          </div>
        </section>
      </ScrollJackContainer>
    </ChladniPattern>
  );
};

export default Index;
