const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';

export const postCadeyUserAgeGroup = async (apiUrl: string, userId: string, ageGroup: string) => {
    const url = `${apiUrl}/ageGroup/${userId}/${ageGroup}`;

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