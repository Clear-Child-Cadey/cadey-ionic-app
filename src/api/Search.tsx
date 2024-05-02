import axios from '../config/AxiosConfig';
import AppMeta from '../variables/AppMeta';

export const postUserSearch = async (
  cadeyUserId: string,
  searchString: string,
  ageGroup: number,
) => {
  const url = `${AppMeta.baseApiUrl}/search`;
  const bodyObject = {
    userId: cadeyUserId,
    searchString: searchString,
    ageGroup: ageGroup,
  };

  const response = await axios.post(url, bodyObject, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
      'Content-Type': 'application/json',
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

  return {
    message: data.message,
    videos: data.videos ? mapVideos(data.videos, 'videos') : [],
    articleIds: data.articleIds ? data.articleIds : [],
  };
};
