import fetchWithTimeout from '../utils/fetchWithTimeout';

let response;

export const postLogin = async (
  apiUrl: string,
  authId: string,
  cadeyUserEmail: string,
) => {
  const url = `${apiUrl}/login`;

  try {
    response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          accept: 'text/plain',
          apiKey: 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authId: authId,
          cadeyUserEmail: cadeyUserEmail,
        }),
      },
      { requestName: 'postLogin' },
    );
  } catch (error) {
    throw new Error(`HTTP error! status: ${error}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};
