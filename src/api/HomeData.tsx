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
  let response;
  const url = `${apiUrl}/homepage/${cadeyUserId}`;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "text/plain",
        apiKey: "XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck",
      },
    });
  } catch (error) {
    throw new Error(`HTTP error! status: ${error}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

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
      ? mapVideos(data.featuredVideos, "featuredVideos")
      : [],
    newVideos: data.newVideos ? mapVideos(data.newVideos, "newVideos") : [],
    playedVideos: data.playedVideos
      ? mapVideos(data.playedVideos, "playedVideos")
      : [],
    trendingVideos: data.trendingVideos
      ? mapVideos(data.trendingVideos, "trendingVideos")
      : [],
    articleIds: data.articleIds ? data.articleIds : [],
  };

  return homeData;
};

export default getHomeData;
