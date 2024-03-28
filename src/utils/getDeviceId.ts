import { v4 as uuidv4 } from 'uuid'; // Used for generating unique ids

const getDeviceId = () => {
  const key = 'device_id_cadey';
  let cadeyUserDeviceId = localStorage.getItem(key);
  if (!cadeyUserDeviceId) {
    cadeyUserDeviceId = uuidv4(); // Generate a new unique id
    localStorage.setItem(key, cadeyUserDeviceId); // Store the id in localStorage
  }
  console.log('DEVICE ID:', cadeyUserDeviceId);
  return cadeyUserDeviceId;
};

export default getDeviceId;
