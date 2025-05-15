
import React from 'react';
import ExportableChladniPattern from '../components/ExportableChladniPattern';
import ScrollJackContainer from '../components/ScrollJackContainer';
import { ChladniScrollJackProps } from './types';

/**
 * Complete Chladni pattern with ScrollJack functionality
 * 
 * @param props.children - The content to display in scrolljack sections
 * @param props.titles - Optional array of titles for each section
 * @returns A component with Chladni background and scrolljacking behavior
 */
const ChladniScrollJack: React.FC<ChladniScrollJackProps> = ({ 
  children, 
  titles 
}) => {
  return (
    <ExportableChladniPattern>
      <div className="flex flex-col">
        <ScrollJackContainer titles={titles}>
          {children}
        </ScrollJackContainer>
      </div>
    </ExportableChladniPattern>
  );
};

export default ChladniScrollJack;
