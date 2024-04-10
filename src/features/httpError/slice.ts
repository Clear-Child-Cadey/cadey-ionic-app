import { createSlice } from '@reduxjs/toolkit';

export interface httpErrorSlice {
  error: boolean;
  errorModalData: {
    title: string;
    body: string;
    buttonText: string;
    actionType: 'RELOAD_PAGE'; // can add more with ' | '
    url?: null;
  };
}

const initialState: httpErrorSlice = {
  error: false,
  errorModalData: {
    title: '',
    body: '',
    buttonText: '',
    actionType: 'RELOAD_PAGE',
    url: null,
  },
};

const httpErrorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setHttpError: (state, action) => {
      state.error = action.payload;
    },
    setHttpErrorModalData: (state, action) => {
      state.error = true;
      state.errorModalData = action.payload;
    },
  },
});

const { setHttpError, setHttpErrorModalData } = httpErrorSlice.actions;

export { setHttpError, setHttpErrorModalData };

export default httpErrorSlice.reducer;
