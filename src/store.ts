import { configureStore, combineReducers } from '@reduxjs/toolkit';
import httpErrorReducer from './features/httpError/slice';
import authStatusReducer from './features/authLoading/slice';
import deviceIdStatusReducer from './features/deviceId/slice';
import videoReducer from './features/video/slice';

const rootReducer = combineReducers({
  httpError: httpErrorReducer,
  authStatus: authStatusReducer,
  deviceIdStatus: deviceIdStatusReducer,
  video: videoReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['authStatus', 'payload', 'authStatus.firebaseUser'],
        ignoredActions: ['authStatus/setFirebaseUser'],
      },
    }),
});

// Define and export RootState type
export type RootState = ReturnType<typeof rootReducer>;

export default store;
