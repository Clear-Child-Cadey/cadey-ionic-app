import { createSlice } from '@reduxjs/toolkit';

interface DeepLinkState {
  route: string;
  videoId: string;
  articleId: number;
}

const initialState: DeepLinkState = {
  route: '',
  videoId: '',
  articleId: 0,
};

export const deepLinkSlice = createSlice({
  name: 'deepLinks',
  initialState,
  reducers: {
    setRoute: (state, action) => {
      state.route = action.payload;
    },
    setVideoId: (state, action) => {
      state.videoId = action.payload;
    },
    setArticleId: (state, action) => {
      state.articleId = action.payload;
    },
  },
});

// Export the action creators
export const { setRoute, setVideoId, setArticleId } = deepLinkSlice.actions;

// Export the reducer
export default deepLinkSlice.reducer;
