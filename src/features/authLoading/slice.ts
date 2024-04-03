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
  appOpenCadeyId: number;
  isAnonymous: Trilean;
  emailVerified: Trilean;
  grandfatherStatus: boolean;
}

const initialState: AuthStatusState = {
  cadeyResolved: 'pending',
  firebaseResolved: 'pending',
  userData: {
    cadeyUser: null,
    firebaseUser: null,
  },
  isAnonymous: 'pending',
  appOpenCadeyId: 0,
  emailVerified: 'pending',
  grandfatherStatus: false,
};

export const authStatusSlice = createSlice({
  name: 'authStatus',
  initialState,
  reducers: {
    setAppOpenCadeyId: (state, action) => {
      state.appOpenCadeyId = action.payload;
    },
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
    setEmailVerified: (state, action) => {
      state.emailVerified = action.payload;
    },
    setGrandfatherStatus: (state, action) => {
      state.grandfatherStatus = action.payload;
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
  setAppOpenCadeyId,
  setEmailVerified,
  setGrandfatherStatus,
} = authStatusSlice.actions;

// Export the reducer
export default authStatusSlice.reducer;
