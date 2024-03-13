import { createSlice } from '@reduxjs/toolkit';
import Trilean from '../../types/Trilean';
import FirebaseUserModel from '../../types/FirebaseUserModel';
import CadeyUserModel from '../../types/CadeyUserModel';

interface AuthStatusState {
  cadeyResolved: Trilean;
  firebaseResolved: Trilean;
  userData: {
    cadeyUser: CadeyUserModel;
    firebaseUser: FirebaseUserModel;
  };
  isAnonymous: Trilean;
}

const initialState: AuthStatusState = {
  cadeyResolved: 'pending',
  firebaseResolved: 'pending',
  userData: {
    cadeyUser: null,
    firebaseUser: null,
  },
  isAnonymous: 'pending',
};

export const authStatusSlice = createSlice({
  name: 'authStatus',
  initialState,
  reducers: {
    setIsAnonymous: (state, action) => {
      state.isAnonymous = action.payload;
    },
    setCadeyResolved: (state, action) => {
      state.cadeyResolved = action.payload;
    },
    setFirebaseResolved: (state, action) => {
      state.firebaseResolved = action.payload;
    },
    setFirebaseUser: (state, action) => {
      state.userData.firebaseUser = action.payload;
    },
    setCadeyUser: (state, action) => {
      state.userData.cadeyUser = action.payload;
    },
  },
});

// Export the action creators
export const {
  setCadeyResolved,
  setFirebaseResolved,
  setCadeyUser,
  setFirebaseUser,
  setIsAnonymous,
} = authStatusSlice.actions;

// Export the reducer
export default authStatusSlice.reducer;
