const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';

export const getUserGoals = async (apiUrl: string, userId: string) => {
    const url = `${apiUrl}/goals/${userId}`;

    const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'accept': 'text/plain',
            'apiKey': API_KEY,
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

    return data.goals.map((goal: { videos: any; }) => ({
        ...goal,
        videos: mapVideos(goal.videos, "goalVideos"),
    }));
};

export const postGoalOptIn = async (apiUrl: string, userId: string, userGoalId: number, optIn: boolean) => {
    const url = `${apiUrl}/goal/${userId}/${userGoalId}/${optIn}`;

    const response = await fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'accept': 'text/plain',
            'apiKey': API_KEY,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}

export const getNewGoalsIndicator = async (apiUrl: string, userId: string) => {
    const url = `${apiUrl}/goalsisnew/${userId}`;

    const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'accept': 'text/plain',
            'apiKey': API_KEY,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export const popularGoals = async (apiUrl: string, userId: string) => {
    const url = `${apiUrl}/populargoals/${userId}`;

    const response = await fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'accept': 'text/plain',
            'apiKey': API_KEY,
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response;
}