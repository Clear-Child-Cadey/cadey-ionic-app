const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';

export const getUserMessages = async (apiUrl: string, userId: string) => {
    const url = `${apiUrl}/api/cadeydata/notificationmessages/${userId}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'text/plain',
            'apiKey': API_KEY,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};
