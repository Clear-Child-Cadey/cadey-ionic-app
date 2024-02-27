import { configureStore } from '@reduxjs/toolkit';
import httpErrorReducer from './features/httpError/slice';

const store = configureStore({
  reducer: {
    httpError: httpErrorReducer,
  },
});

export default store;
