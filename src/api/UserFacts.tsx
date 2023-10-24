const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';
const headers = {
  'accept': 'text/plain',
  'apiKey': API_KEY,
  'Content-Type': 'application/json',
};

interface LogUserFactOptions {
  cadeyUserId: string;
  baseApiUrl: string;
  userFactTypeName: string;
  appPage: string;
  detail1?: string;
  detail2?: string;
  detail3?: string;
  detail4?: string;
  detail5?: string;
  detail6?: string;
  detail7?: string;
  detail8?: string;
  detail9?: string;
}

export const logUserFact = async ({
  cadeyUserId,
  baseApiUrl,
  userFactTypeName,
  appPage,
  detail1 = "",
  detail2 = "",
  detail3 = "",
  detail4 = "",
  detail5 = "",
  detail6 = "",
  detail7 = "",
  detail8 = "",
  detail9 = ""
}: LogUserFactOptions) => {
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      userid: cadeyUserId,
      userFactTypeName: userFactTypeName,
      appPage: appPage,
      detail1,
      detail2,
      detail3,
      detail4,
      detail5,
      detail6,
      detail7,
      detail8,
      detail9,
    }),
  };

  try {
    const response = await fetch(`${baseApiUrl}/userfact`, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling userfact: ', error);
    throw error;
  }
}