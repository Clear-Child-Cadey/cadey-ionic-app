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

    return data.goals;
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