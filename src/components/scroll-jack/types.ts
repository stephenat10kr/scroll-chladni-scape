
import React from 'react';

export interface ScrollJackContainerProps {
  children: React.ReactNode; 
  titles?: string[];
}

export interface UseScrollJackResult {
  containerRef: React.RefObject<HTMLDivElement>;
  activeSection: number;
  previousSection: number | null;
  animationDirection: 'up' | 'down';
  sectionCount: number;
  sectionTitles: React.ReactNode[];
  hasReachedEnd: boolean;
  isInView: boolean;
  setActiveSection: React.Dispatch<React.SetStateAction<number>>;
  setPreviousSection: React.Dispatch<React.SetStateAction<number | null>>;
  setAnimationDirection: React.Dispatch<React.SetStateAction<'up' | 'down'>>;
  setHasReachedEnd: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInView: React.Dispatch<React.SetStateAction<boolean>>;
}
