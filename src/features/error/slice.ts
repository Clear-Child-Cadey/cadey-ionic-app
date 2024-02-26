import { createSlice, current } from '@reduxjs/toolkit';

export interface errorSlice {
  httpError: boolean;
  httpErrorModalData: {
    title: string;
    body: string;
    buttonText: string;
    buttonAction: () => void;
  };
}

const initialState: errorSlice = {
  httpError: false,
  httpErrorModalData: {
    title: '',
    body: '',
    buttonText: '',
    buttonAction: () => {
      /* Default implementation */
    },
  },
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setHttpError: (state, action) => {
      state.httpError = action.payload;
    },
    setHttpErrorModalData: (state, action) => {
      state.httpError = true;
      state.httpErrorModalData = action.payload;
    },
  },
});

const { setHttpError, setHttpErrorModalData } = errorSlice.actions;

export { setHttpError, setHttpErrorModalData };

export default errorSlice.reducer;
