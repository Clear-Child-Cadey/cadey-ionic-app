import { useSelector } from 'react-redux';
import LogDeviceFactOptions from '../interfaces/LogDeviceFactOptions';
import getDeviceId from '../utils/getDeviceId';
import { RootState } from '../store';
import axios from '../config/AxiosConfig';
import AppMeta from '../variables/AppMeta';

const useDeviceFacts = () => {
  const headers = {
    accept: 'text/plain',
    apiKey: AppMeta.cadeyApiKey,
    'Content-Type': 'application/json',
  };
  const url = `${AppMeta.baseApiUrl}/devicefact`;

  const cadeyUserId = useSelector((state: RootState) => {
    return state.authStatus.userData.cadeyUser?.cadeyUserId || 0;
  });

  const logDeviceFact = async (facts: LogDeviceFactOptions) => {
    facts.deviceId = getDeviceId();
    facts.userId = cadeyUserId;

    const response = await axios.post(url, facts, {
      headers: headers,
    });

    return await response.data;
  };

  return {
    logDeviceFact,
  };
};

export default useDeviceFacts;
