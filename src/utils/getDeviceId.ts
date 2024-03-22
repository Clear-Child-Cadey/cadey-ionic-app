import { v4 as uuidv4 } from 'uuid'; // Used for generating unique ids

const getVersionDetails = async () => {
  if (!window.cordova || !window.cordova.getAppVersion) {
    console.warn(
      'Cordova or getAppVersion plugin not available. Using fallback.',
    );
    return { versionCode: '0', versionNumber: '0' };
  }

  try {
    const versionCode = await window.cordova.getAppVersion.getVersionCode();
    const versionNumber = await window.cordova.getAppVersion.getVersionNumber();
    return {
      versionCode: String(versionCode),
      versionNumber: String(versionNumber),
    };
  } catch (error) {
    console.error('Error getting version details:', error);
    return { versionCode: 'error', versionNumber: 'error' };
  }
};

const getDeviceId = async () => {
  const key = 'cadey_user_device_id_2.0.0';
  try {
    let cadeyUserDeviceId = localStorage.getItem(key);
    if (!cadeyUserDeviceId) {
      const { versionCode, versionNumber } = await getVersionDetails();
      cadeyUserDeviceId = `${versionCode}.${versionNumber}.${uuidv4()}`; // Generate a new id
      localStorage.setItem(key, cadeyUserDeviceId); // Store the id in localStorage
    }
    console.log('DEVICEID......', cadeyUserDeviceId);
    return cadeyUserDeviceId;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    // Return a temporary ID or handle the error as needed
    const { versionCode, versionNumber } = await getVersionDetails();
    return `temp-${versionCode}.${versionNumber}.${uuidv4()}`;
  }
};

export default getDeviceId;
