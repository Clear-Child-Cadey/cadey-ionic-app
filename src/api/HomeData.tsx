import axios from '../config/AxiosConfig';
import AppMeta from '../variables/AppMeta';

export interface HomeData {
  numPathsInProgress: number;
  numCompletedPaths: number;
  numTotalPaths: number;
  featuredVideos: any[];
  newVideos: any[];
  playedVideos: any[];
  trendingVideos: any[];
  articleIds: any[];
}

const getHomeData = async (apiUrl: string, cadeyUserId: string) => {
  const url = `${apiUrl}/homepage/${cadeyUserId}`;

  const response = await axios.get(url, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  const data = await response.data;

  const mapVideos = (videos: any, videoType: string) =>
    videos.map(
      (video: {
        sourceId: any;
        mediaId: any;
        title: any;
        audience: any;
        thumbnail: any;
      }) => ({
        sourceId: video.sourceId,
        mediaId: String(video.mediaId), // Convert the mediaId to a string
        title: video.title,
        audience: video.audience,
        videoType: videoType,
        thumbnail: video.thumbnail,
      }),
    );

  const homeData: HomeData = {
    numPathsInProgress: data.numPathsInProgress ? data.numPathsInProgress : 0,
    numCompletedPaths: data.numCompletedPaths ? data.numCompletedPaths : 0,
    numTotalPaths: data.numTotalPaths ? data.numTotalPaths : 0,
    featuredVideos: data.featuredVideos
      ? mapVideos(data.featuredVideos, 'featuredVideos')
      : [],
    newVideos: data.newVideos ? mapVideos(data.newVideos, 'newVideos') : [],
    playedVideos: data.playedVideos
      ? mapVideos(data.playedVideos, 'playedVideos')
      : [],
    trendingVideos: data.trendingVideos
      ? mapVideos(data.trendingVideos, 'trendingVideos')
      : [],
    articleIds: data.articleIds ? data.articleIds : [],
  };

  return homeData;
};

export default getHomeData;
