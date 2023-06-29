// Import necessary libraries
import { isPlatform } from '@ionic/react'; // Helps to identify the platform (iOS, Android, Web) the app is running on
import { v4 as uuidv4 } from 'uuid'; // Used for generating unique ids
import { appOpenedLambda } from './LambdaLogging'; // Import logging method

// Try to retrieve a previously stored device id, if not available then generate a new unique id for the device
let cadeyUserDeviceId = localStorage.getItem('cadey_user_device_id');
if (!cadeyUserDeviceId) {
  cadeyUserDeviceId = uuidv4(); // Generate a new unique id
  localStorage.setItem('cadey_user_device_id', cadeyUserDeviceId); // Store the id in localStorage
}

// Define a function to fetch application data
export const getAppData = async (
    setCadeyUserId: any, 
    setMinimumSupportedVersion: any, 
    apiUrl: any,
    setIsHomeTabVisible: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
  
    // Define the url for the request
  const url = `${apiUrl}/api/cadeydata/appopened`;

  // Determine the platform on which the app is running
  let devicePlatform;
  if (isPlatform('ios')) {
    devicePlatform = 'iOS';
  } else if (isPlatform('android')) {
    devicePlatform = 'Android';
  } else {
    devicePlatform = 'Web';
  }

  // Prepare the body of the request
  const bodyObject = {
    cadeyUserId: 0,
    cadeyUserDeviceId: cadeyUserDeviceId,
    cadeyMinimumSupportedAppVersion: "",
    cadeyLatestAppVersion: "",
    cadeyDevicePlatform: devicePlatform
  };

  // Define the request options
  const requestOptions = {
    method: 'POST',
    headers: { 
      'accept': 'text/plain', 
      'apiKey': 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyObject)
  };

  // Try to perform the request and handle the response
  try {
    const response = await fetch(url, requestOptions); // Perform the request
    const data = await response.json(); // Parse the response data as json

    setCadeyUserId(data.cadeyUserId); // Update the Cadey User ID state
    setMinimumSupportedVersion(data.cadeyMinimumSupportedAppVersion); // Update the Minimum Supported Version state
    
    // Set the visibility of the Home tab based on the response data
    console.log('First Page: ', data.firstPageToShow);
    if (data.firstPageToShow === "home") {
      setIsHomeTabVisible(true);
      console.log('Home tab is visible');
    }

    const mapVideos = (videos: any) => videos.map((video: { sourceId: any; mediaId: any; title: any; audience: any; }) => ({
      videoId: video.sourceId,
      mediaId: String(video.mediaId), // Convert the mediaId to a string
      title: video.title,
      audience: video.audience
    }));
    
    // Log in the database that a user has opened the app
    appOpenedLambda(data.cadeyUserId);

  } catch (error) { // Handle any errors during the request
    console.error('Error during API call', error);
  }
};

// Export the getAppData function as default
export default getAppData;