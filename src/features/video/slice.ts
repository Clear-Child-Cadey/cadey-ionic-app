import { createSlice } from '@reduxjs/toolkit';
import Trilean from '../../types/Trilean';
import FirebaseUserModel from '../../types/FirebaseUserModel';
import CadeyUserModel from '../../types/CadeyUserModel';

interface VideoState {
  playing: boolean;
  quizModalOpen: boolean;
}

const initialState: VideoState = {
  playing: false,
  quizModalOpen: false,
};

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setPlaying: (state, action) => {
      state.playing = action.payload;
    },
    setQuizModalOpen: (state, action) => {
      state.quizModalOpen = action.payload;
    },
  },
});

// Export the action creators
export const { setPlaying, setQuizModalOpen } = videoSlice.actions;

// Export the reducer
export default videoSlice.reducer;
