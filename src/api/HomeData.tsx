import { useContext } from 'react';
import ApiUrlContext from '../context/ApiUrlContext';
import { CadeyUserContext } from '../main';

const getHomeData = () => {  
    const { apiUrl } = useContext(ApiUrlContext);
    const { cadeyUserId } = useContext(CadeyUserContext);

    const getHomeDataFromApi = async () => {
        const url = `${apiUrl}/homepage/${cadeyUserId}`;

        const response = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'text/plain',
            'apiKey': 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
        },
        });

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const mapVideos = (videos: any, videoType: string) => videos.map((video: { sourceId: any; mediaId: any; title: any; audience: any; thumbnail: any; }) => ({
            sourceId: video.sourceId,
            mediaId: String(video.mediaId), // Convert the mediaId to a string
            title: video.title,
            audience: video.audience,
            videoType: videoType,
            thumbnail: video.thumbnail,
          }));

          return { 
            featuredVideos: data.featuredVideos ? mapVideos(data.featuredVideos, "featuredVideos") : [], 
            newVideos: data.newVideos ? mapVideos(data.newVideos, "newVideos") : [], 
            playedVideos: data.playedVideos ? mapVideos(data.playedVideos, "playedVideos") : [],
            trendingVideos: data.trendingVideos ? mapVideos(data.trendingVideos, "trendingVideos") : [],
            articleIds: data.articleIds ? data.articleIds : [],
        };
    };

    return { getHomeDataFromApi };
};

export default getHomeData;
