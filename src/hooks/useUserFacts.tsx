import { useSelector } from 'react-redux';
import LogUserFactOptions from '../interfaces/LogUserFactOptions';
import getDeviceId from '../utils/getDeviceId';
import { RootState } from '../store';
import axios from '../config/AxiosConfig';
import AppMeta from '../variables/AppMeta';

const useUserFacts = () => {
  const headers = {
    accept: 'text/plain',
    apiKey: AppMeta.cadeyApiKey,
    'Content-Type': 'application/json',
  };

  const cadeyUserId = useSelector((state: RootState) => {
    return state.authStatus.userData.cadeyUser?.cadeyUserId;
  });

  const url = `${AppMeta.baseApiUrl}/userfact`;

  const logUserFact = async (facts: LogUserFactOptions) => {
    if (cadeyUserId === 0) {
      throw new Error('Cadey User ID is 0');
    }

    facts.deviceId = getDeviceId();
    facts.userId = cadeyUserId;

    const response = await axios.post(url, facts, {
      headers,
    });

    return await response.data;
  };

  return {
    logUserFact,
  };
};

export default useUserFacts;
