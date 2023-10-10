import React from 'react';

// Define the context
type UnreadContextType = {
  unreadMessagesCount: number;
  setUnreadMessagesCount?: React.Dispatch<React.SetStateAction<number>>; // This allows for setting the unreadMessagesCount later
  unreadGoals: boolean;
  setUnreadGoals?: React.Dispatch<React.SetStateAction<boolean>>; // This allows for setting the unreadGoals later
};

// Create the context
const UnreadContext = React.createContext<UnreadContextType>({
  unreadMessagesCount: 0, // setting default value
  unreadGoals: false, // setting default value
});

// Export the context for use in other components
export default UnreadContext;