const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';

export const getVideoDetailData = async (apiUrl: string, sourceId1: string, sourceId2: string) => {
    const url = `${apiUrl}/videodetails/${sourceId1}/${sourceId2}`;

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
