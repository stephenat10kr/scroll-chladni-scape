
import React from 'react';

export interface ScrollJackContainerProps {
  children: React.ReactNode;
  titles?: string[];
  triggerRef?: React.RefObject<HTMLDivElement>;
}

export interface ScrollJackTitleProps {
  titles: string[];
  activeSection: number;
  previousSection: number | null;
  animationDirection: 'up' | 'down';
}

export interface NavigationDotsProps {
  sectionCount: number;
  activeSection: number;
  onSectionChange: (index: number) => void;
}
