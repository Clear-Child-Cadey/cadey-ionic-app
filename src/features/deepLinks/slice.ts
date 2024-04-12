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
      console.log('Route:', action.payload);
    },
    setVideoId: (state, action) => {
      state.videoId = action.payload;
      console.log('Video ID:', action.payload);
    },
    setArticleId: (state, action) => {
      state.articleId = action.payload;
      console.log('Article ID:', action.payload);
    },
  },
});

// Export the action creators
export const { setRoute, setVideoId, setArticleId } = deepLinkSlice.actions;

// Export the reducer
export default deepLinkSlice.reducer;
