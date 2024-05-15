import React, { useEffect } from 'react';
import ApiUrlContext from '../context/ApiUrlContext';
import getDeviceId from '../utils/getDeviceId';
import AppMeta from '../variables/AppMeta';
import { useDispatch, useSelector } from 'react-redux';
import { setGrandfatherStatus } from '../features/authLoading/slice';
import axios from '../config/AxiosConfig';
import { Capacitor } from '@capacitor/core';
import { setCadeyMinimumSupportedAppVersion } from '../features/appVersion/slice';
import { RootState } from '../store';

const useAppOpened = () => {
  const { apiUrl } = React.useContext(ApiUrlContext);
  const dispatch = useDispatch();
  const appVersionStatus = useSelector((state: RootState) => {
    return state.appVersion;
  });

  const { cadeyMinimumSupportedAppVersion } = appVersionStatus;

  const appOpenAction = async () => {
    const url = `${apiUrl}/cadeyappopened`;
    const cadeyUserDeviceId = await getDeviceId();
    const devicePlatform = Capacitor.getPlatform(); // 'android', 'ios', or 'web'

    const bodyObject = {
      cadeyUserDeviceId,
      cadeyDevicePlatform: devicePlatform,
    };

    try {
      // Use Axios to make the POST request
      const response = await axios.post(url, bodyObject, {
        headers: {
          accept: 'text/plain',
          apiKey: AppMeta.cadeyApiKey,
          'Content-Type': 'application/json',
        },
      });

      // Axios automatically throws an error on bad status, so no need to check response.ok
      const data = response.data; // response from Axios already parsed as JSON

      // Set the minimum supported version
      console.log(
        'Setting minimum supported app version to',
        data.cadeyMinimumSupportedAppVersion,
      );
      dispatch(
        setCadeyMinimumSupportedAppVersion(
          data.cadeyMinimumSupportedAppVersion,
        ),
      );

      const grandfatherSignup =
        data.companyName === 'Grandfather' && data.authId === null;
      if (grandfatherSignup) {
        dispatch(setGrandfatherStatus(true));
      }

      return { grandfatherSignup };
    } catch (error) {
      console.error('HTTP error!', error.response || error);
      throw error; // Rethrow after logging
    }
  };

  return {
    appOpenAction,
  };
};

export default useAppOpened;
