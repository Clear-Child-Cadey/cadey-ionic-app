const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';

export const getQuiz = async (
    apiUrl: string, 
    cadeyUserId: number, 
    clientContext: number,  // Where the user is in the app
                                // 1 = VideoDetail
    entityType: number,     // 1 = video, 2 = article
    entityIds: [number]     // The ID of the video or article
) => {
    const url = `${apiUrl}/quiz`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'accept': 'text/plain',
            'apiKey': API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cadeyUserId: cadeyUserId,
            clientContext: clientContext,
            entityType: entityType,
            entityIds: entityIds,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};
