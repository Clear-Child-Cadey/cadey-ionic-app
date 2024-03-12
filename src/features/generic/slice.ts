import { createSlice } from '@reduxjs/toolkit';

export interface genericSlice {
  loading: boolean;
}

const initialState: genericSlice = {
  loading: false,
};

const genericSlice = createSlice({
  name: 'generic',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

const { setLoading } = genericSlice.actions;

export { setLoading };

export default genericSlice.reducer;
