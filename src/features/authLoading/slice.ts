// src/store/features/authStatus/slice.ts
import { createSlice } from '@reduxjs/toolkit';

interface AuthStatusState {
  authLoading: boolean;
}

const initialState: AuthStatusState = {
  authLoading: false,
};

export const authStatusSlice = createSlice({
  name: 'authStatus',
  initialState,
  reducers: {
    // Action to set the loading state
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
  },
});

// Export the action creators
export const { setAuthLoading } = authStatusSlice.actions;

// Export the reducer
export default authStatusSlice.reducer;
