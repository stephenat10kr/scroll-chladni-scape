
import React from 'react';
import ExportableChladniPattern from './ExportableChladniPattern';

const ChladniBackgroundExample: React.FC = () => {
  return (
    <ExportableChladniPattern>
      {/* Your page content goes here */}
      <div className="container mx-auto py-20 px-4 min-h-screen">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">Your App Title</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-white">
            This is an example of how to add the Chladni pattern as a background in another project.
          </p>
        </div>
        
        {/* Your own content */}
        <div className="space-y-20">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Section Title</h2>
            <p className="text-white">Your content here...</p>
          </div>
        </div>
      </div>
    </ExportableChladniPattern>
  );
};

export default ChladniBackgroundExample;
