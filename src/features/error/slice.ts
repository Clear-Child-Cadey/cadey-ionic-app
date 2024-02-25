import { createSlice, current } from "@reduxjs/toolkit";

export interface errorSlice {
  httpError: boolean;
}

const initialState = {
  httpError: false,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setHttpError: (state, action) => {
      debugger;
      state.httpError = action.payload;
    },
  },
});

const { setHttpError } = errorSlice.actions;

export { setHttpError };

export default errorSlice.reducer;
