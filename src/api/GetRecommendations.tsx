import fetchWithTimeout from "../utils/fetchWithTimeout";

export const getRecommendations = async (
    apiUrl: string,
    cadeyUserId: string,
    ageGroup: number,
    symptoms: any[]
) => {
    let response;
    const url = `${apiUrl}/getrecommendations?cadeyUserId=${cadeyUserId}&ageGroup=${ageGroup}&symptomIds=${symptoms.map(symptom => symptom.id).join('&symptomIds=')}`;

    try {
        response = await fetchWithTimeout(
          url,
          {
            method: "GET",
            headers: {
              accept: "text/plain",
              apiKey: "XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck",
            },
          },
          { cadeyUserId, requestName: "getRecommendations" },
        );
      } catch (error) {
        throw new Error(`HTTP error! status: ${error}`);
      }
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    const data = await response.json();

    return data;
};