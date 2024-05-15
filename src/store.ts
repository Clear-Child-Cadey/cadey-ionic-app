import { configureStore, combineReducers } from '@reduxjs/toolkit';
import httpErrorReducer from './features/httpError/slice';
import authStatusReducer from './features/authLoading/slice';
import deviceIdStatusReducer from './features/deviceId/slice';
import videoReducer from './features/video/slice';
import deepLinkReducer from './features/deepLinks/slice';
import appVersionReducer from './features/appVersion/slice';

const rootReducer = combineReducers({
  httpError: httpErrorReducer,
  authStatus: authStatusReducer,
  deviceIdStatus: deviceIdStatusReducer,
  video: videoReducer,
  deepLink: deepLinkReducer,
  appVersion: appVersionReducer,
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
