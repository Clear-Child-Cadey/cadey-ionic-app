import axios from '../config/AxiosConfig';
import AppMeta from '../variables/AppMeta';

export const getUserSymptoms = async (cadeyUserId: string) => {
  const url = `${AppMeta.baseApiUrl}/usersymptoms/${cadeyUserId}`;
  const response = await axios.get(url, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  return await response.data;
};
