import fetchWithTimeout from '../utils/fetchWithTimeout';
import AppMeta from '../variables/AppMeta';

export const getUserMessages = async (apiUrl: string, cadeyUserId: number) => {
  let response;
  const url = `${apiUrl}/notificationmessages/${cadeyUserId}`;

  try {
    response = await fetchWithTimeout(
      url,
      {
        method: 'GET',
        headers: {
          accept: 'text/plain',
          apiKey: AppMeta.cadeyApiKey,
        },
      },
      { cadeyUserId, requestName: 'getUserMessages' },
    );
  } catch (error) {
    throw new Error(`HTTP error! status: ${error}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};
