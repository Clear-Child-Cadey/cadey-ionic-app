import fetchWithTimeout from "../utils/fetchWithTimeout";

export const getConcerns = async (apiUrl: string, cadeyUserId: string) => {
    let response;
    const url = `${apiUrl}/getconcerns`;

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
          { cadeyUserId, requestName: "getConcerns" },
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