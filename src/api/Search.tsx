const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';

export const postUserSearch = async (apiUrl: string, userId: string, searchString: string, ageGroup: number) => {
    const url = `${apiUrl}/search`;

    const response = await fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'accept': 'text/plain',
            'apiKey': API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: userId,
            searchString: searchString,
            ageGroup: ageGroup,
        }),
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
        message: data.message,
        videos: data.videos ? mapVideos(data.videos, "videos") : [], 
        articleIds: data.articleIds ? data.articleIds : [],
    };

}