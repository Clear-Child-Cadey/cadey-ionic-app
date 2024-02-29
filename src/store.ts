import { configureStore, combineReducers } from '@reduxjs/toolkit';
import httpErrorReducer from './features/httpError/slice';
import authStatusReducer from './features/authLoading/slice';

const rootReducer = combineReducers({
  httpError: httpErrorReducer,
  authStatus: authStatusReducer,
});

// Create the store
const store = configureStore({
  reducer: rootReducer,
});

// Define and export RootState type
export type RootState = ReturnType<typeof rootReducer>;

export default store;
