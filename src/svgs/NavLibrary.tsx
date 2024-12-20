import React from 'react';

// Define a type for the component props
type SVGIconProps = {
  className?: string;
};

export const LibraryIcon: React.FC<SVGIconProps> = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.5 2.25H7.5C6.90326 2.25 6.33097 2.48705 5.90901 2.90901C5.48705 3.33097 5.25 3.90326 5.25 4.5V21.75L12 15.75L18.75 21.75V4.5C18.75 3.90326 18.5129 3.33097 18.091 2.90901C17.669 2.48705 17.0967 2.25 16.5 2.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);