import React from 'react';

// Define a type for the component props
type SVGIconProps = {
  className?: string;
};

export const PathsIcon: React.FC<SVGIconProps> = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 3H17.5469C19.454 3 21 4.54602 21 6.45312V6.45312C21 8.36023 19.454 9.90625 17.5469 9.90625H6.54687C4.0357 9.90625 2 11.942 2 14.4531V14.4531C2 16.9643 4.03571 19 6.54688 19H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="19" cy="19" r="2.25" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);