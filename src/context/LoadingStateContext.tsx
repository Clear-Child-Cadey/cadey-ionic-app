// LoadingStateContext.ts
import React, { createContext, useContext, useReducer } from 'react';

// Define the shape of the loading state.
type LoadingState = {
    homepageData: boolean;
    articleLists: boolean;
    articleDetail: boolean;
    videoLists: boolean;
    videoDetail: boolean;
};

// Define possible actions for our reducer.
type Action = 
    | { type: 'SET_LOADING'; payload: { key: keyof LoadingState; value: boolean } };

// Define the shape of the context value.
type LoadingStateContextValue = {
    state: LoadingState;
    dispatch: React.Dispatch<Action>;
};

// Define prop types for the LoadingStateProvider component.
type LoadingStateProviderProps = {
    children: React.ReactNode;
};

// Create a context with a potential undefined default value.
const LoadingStateContext = createContext<LoadingStateContextValue | undefined>(undefined);

// Initial state for our reducer.
const initialState = {
    homepageData: false,
    articleLists: false,
    articleDetail: false,
    videoLists: false,
    videoDetail: false,
};

// Reducer function to manage loading states.
const reducer = (state: LoadingState, action: Action): LoadingState => {
    switch (action.type) {
      // Update the specific loading state.
      case 'SET_LOADING':
        return { ...state, [action.payload.key]: action.payload.value };
      default:
        // Throw an error if an unsupported action type is dispatched.
        throw new Error(`Unsupported action type ${action.type}`);
    }
};

// Provider component to wrap parts of our app where we want to access our loading states.
export const LoadingStateProvider: React.FC<LoadingStateProviderProps> = ({ children }) => {
    // Use the React useReducer hook to manage state and dispatch function.
    const [state, dispatch] = useReducer(reducer, initialState);

    // Provide the state and dispatch function to child components.
    return (
        <LoadingStateContext.Provider value={{ state, dispatch }}>
            {children}
        </LoadingStateContext.Provider>
    );
};

// Custom hook to use the LoadingStateContext. This hook can be used in any child component
// within the LoadingStateProvider to get the current loading state or dispatch actions.
export const useLoadingState = () => {
    const context = useContext(LoadingStateContext);

    // Ensure the hook is used within the provider.
    if (!context) {
        throw new Error('useLoadingState must be used within a LoadingStateProvider');
    }

    return context;
};