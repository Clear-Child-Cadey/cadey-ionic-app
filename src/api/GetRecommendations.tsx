const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';

export const getRecommendations = async (
    apiUrl: string,
    cadeyUserId: string,
    ageGroup: number,
    symptoms: any[]
) => {
    const url = `${apiUrl}/getrecommendations?cadeyUserId=${cadeyUserId}&ageGroup=${ageGroup}&symptomIds=${symptoms.map(symptom => symptom.id).join('&symptomIds=')}`;

    const requestOptions = {
        method: 'GET',
        headers: {
            accept: 'text/plain',
            apiKey: API_KEY,
        },
    };

    const recommendationsResponse = await fetch(url, requestOptions);
    const data = await recommendationsResponse.json();

    return data;
};