import axios from '../config/AxiosConfig';
import AppMeta from '../variables/AppMeta';

export const getUserMessages = async (cadeyUserId: number) => {
  const url = `${AppMeta.baseApiUrl}/notificationmessages/${cadeyUserId}`;
  const response = await axios.get(url, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  return await response.data;
};
