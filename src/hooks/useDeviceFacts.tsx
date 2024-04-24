import { useSelector } from 'react-redux';
import LogDeviceFactOptions from '../interfaces/LogDeviceFactOptions';
import fetchWithTimeout from '../utils/fetchWithTimeout';
import getDeviceId from '../utils/getDeviceId';
import AppMeta from '../variables/AppMeta';
import { RootState } from '../store';

const useDeviceFacts = () => {
  const headers = {
    accept: 'text/plain',
    apiKey: AppMeta.cadeyApiKey,
    'Content-Type': 'application/json',
  };

  const cadeyUserId = useSelector((state: RootState) => {
    return state.authStatus.userData.cadeyUser?.cadeyUserId;
  });

  const logDeviceFact = async (facts: LogDeviceFactOptions) => {
    facts.deviceId = getDeviceId();
    facts.userId = cadeyUserId;

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(facts),
    };

    try {
      let response;
      const url = `${AppMeta.baseApiUrl}/devicefact`;

      try {
        response = await fetchWithTimeout(url, requestOptions, {
          cadeyUserId,
          requestName: 'postDeviceFact',
        });
      } catch (error) {
        throw new Error(`HTTP error! status: ${error}`);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling devicefact: ', error);
      throw error;
    }
  };

  return {
    logDeviceFact,
  };
};

export default useDeviceFacts;
