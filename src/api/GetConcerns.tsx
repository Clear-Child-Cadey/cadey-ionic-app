import axios from '../config/AxiosConfig';
import AppMeta from '../variables/AppMeta';

export const getConcerns = async () => {
  const url = `${AppMeta.baseApiUrl}/getconcerns`;

  const response = await axios.get(url, {
    headers: {
      accept: 'text/plain',
      apiKey: AppMeta.cadeyApiKey,
    },
  });

  return await response.data;
};
