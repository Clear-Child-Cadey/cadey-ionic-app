import fetchWithTimeout from "../utils/fetchWithTimeout";

const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';

export const postCadeyUserAgeGroup = async (apiUrl: string, cadeyUserId: string, ageGroup: string) => {
    let response;
    const url = `${apiUrl}/ageGroup/${cadeyUserId}/${ageGroup}`;

    try {
        response = await fetchWithTimeout(
          url,
          {
            method: "POST",
            headers: {
              accept: "text/plain",
              apiKey: "XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck",
            },
          },
          { cadeyUserId, requestName: "postCadeyUserAgeGroup" },
        );
      } catch (error) {
        throw new Error(`HTTP error! status: ${error}`);
      }
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response;
}