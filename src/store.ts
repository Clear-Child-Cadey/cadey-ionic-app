import { configureStore, combineReducers } from '@reduxjs/toolkit';
import httpErrorReducer from './features/httpError/slice';
import authStatusReducer from './features/authLoading/slice';
import deviceIdStatusReducer from './features/deviceId/slice';

const rootReducer = combineReducers({
  httpError: httpErrorReducer,
  authStatus: authStatusReducer,
  deviceIdStatus: deviceIdStatusReducer,
});

// Create the store
const store = configureStore({
  reducer: rootReducer,
});

// Define and export RootState type
export type RootState = ReturnType<typeof rootReducer>;

export default store;
