import { createSlice } from '@reduxjs/toolkit';

interface appVersionState {
  cadeyMinimumSupportedAppVersion: string;
}

const initialState: appVersionState = {
  cadeyMinimumSupportedAppVersion: '',
};

export const appVersionSlice = createSlice({
  name: 'appVersion',
  initialState,
  reducers: {
    setCadeyMinimumSupportedAppVersion: (state, action) => {
      state.cadeyMinimumSupportedAppVersion = action.payload;
    },
  },
});

// Export the action creators
export const { setCadeyMinimumSupportedAppVersion } = appVersionSlice.actions;

// Export the reducer
export default appVersionSlice.reducer;
