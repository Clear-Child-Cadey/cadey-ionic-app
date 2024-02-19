import fetchWithTimeout from "../utils/fetchWithTimeout";

export const getUserMessages = async (apiUrl: string, cadeyUserId: string) => {
    let response;
    const url = `${apiUrl}/notificationmessages/${cadeyUserId}`;

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
          { cadeyUserId, requestName: "getUserMessages" },
        );
      } catch (error) {
        throw new Error(`HTTP error! status: ${error}`);
      }
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    return await response.json();
};
