import React from 'react';

// Define the context
type UnreadCountContextType = {
  unreadCount: number;
  setUnreadCount?: React.Dispatch<React.SetStateAction<number>>; // This allows for setting the unreadCount later
};

// Create the context
const UnreadCountContext = React.createContext<UnreadCountContextType>({
    unreadCount: 0 // setting default value
  });

// Export the context for use in other components
export default UnreadCountContext;