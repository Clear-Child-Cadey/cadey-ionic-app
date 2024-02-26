import { createSlice, current } from "@reduxjs/toolkit";

export interface errorSlice {
  httpError: boolean;
  httpErrorData: {
    title: string;
    body: string;
    buttonText: string;
    buttonAction: () => void;
  };
}

const initialState: errorSlice = {
  httpError: false,
  httpErrorData: {
    title: "",
    body: "",
    buttonText: "",
    buttonAction: () => {
      /* Default implementation */
    },
  },
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setHttpError: (state, action) => {
      state.httpError = action.payload;
    },
    setHttpErrorData: (state, action) => {
      state.httpError = true;
      state.httpErrorData = action.payload;
    },
  },
});

const { setHttpError, setHttpErrorData } = errorSlice.actions;

export { setHttpError, setHttpErrorData };

export default errorSlice.reducer;
