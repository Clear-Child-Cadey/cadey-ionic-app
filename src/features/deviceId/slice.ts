import { createSlice } from '@reduxjs/toolkit';

interface DeviceIdState {
  deviceId: string;
}

const initialState: DeviceIdState = {
  deviceId: '',
};

export const deviceIdSlice = createSlice({
  name: 'deviceId',
  initialState,
  reducers: {
    // Action to set the device id
    setDeviceId: (state, action) => {
      state.deviceId = action.payload;
    },
  },
});

// Export the action creators
export const { setDeviceId } = deviceIdSlice.actions;

// Export the reducer
export default deviceIdSlice.reducer;
