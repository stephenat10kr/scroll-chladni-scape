
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
              Blah blah blah
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="container mx-auto px-4 min-h-screen flex flex-col justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">Section 2</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-white">
              Blah blah blah
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="container mx-auto px-4 min-h-screen flex flex-col justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">Section 3</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-white">
              Blah blah blah
            </p>
          </div>
        </section>
      </ScrollJackContainer>
    </ChladniPattern>
  );
};

export default Index;
