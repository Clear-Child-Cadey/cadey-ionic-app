const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';

export const getUserSymptoms = async (apiUrl: string, userId: string) => {
    const url = `${apiUrl}/usersymptoms/${userId}`;

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

    return data;
};