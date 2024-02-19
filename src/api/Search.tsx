import fetchWithTimeout from "../utils/fetchWithTimeout";

export const postUserSearch = async (apiUrl: string, cadeyUserId: string, searchString: string, ageGroup: number) => {
    let response;
    const url = `${apiUrl}/search`;

    try {
        response = await fetchWithTimeout(
          url,
          {
            method: "POST",
            headers: {
              accept: "text/plain",
              apiKey: "XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck",
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: cadeyUserId,
                searchString: searchString,
                ageGroup: ageGroup,
            }),
          },
          { cadeyUserId, requestName: "postUserSearch" },
        );
      } catch (error) {
        throw new Error(`HTTP error! status: ${error}`);
      }
    
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