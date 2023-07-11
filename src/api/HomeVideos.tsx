import { useContext } from 'react';
import ApiUrlContext from '../context/ApiUrlContext';
import { CadeyUserContext } from '../main';

const getHomeVideos = () => {  
    const apiUrl = useContext(ApiUrlContext);
    const { cadeyUserId } = useContext(CadeyUserContext);

    const getHomeVideoData = async () => {
        const url = `${apiUrl}/api/cadeydata/homepage/${cadeyUserId}`;

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

        const mapVideos = (videos: any) => videos.map((video: { sourceId: any; mediaId: any; title: any; audience: any; }) => ({
            videoId: video.sourceId,
            mediaId: String(video.mediaId), // Convert the mediaId to a string
            title: video.title,
            audience: video.audience
          }));

        return { newVideos: mapVideos(data.newVideos), playedVideos: mapVideos(data.playedVideos) };
    };

    return { getHomeVideoData };
};

export default getHomeVideos;
