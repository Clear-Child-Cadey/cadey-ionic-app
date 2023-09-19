/**
 * Fetches the thumbnail URL for a given Vimeo video ID.
 *
 * @param videoId The Vimeo video ID.
 * @returns Promise resolving to the thumbnail URL or null in case of an error.
 */

const accessToken = '4874fe9bbbd878241fbb0747a85ae97e'; 

const getVideoThumbnail = async (videoId: string): Promise<string | null> => {
  
  // Extract only the first part of the videoId before the `/`
  const extractedVideoId = videoId.split('/')[0];
  
  try {
    const response = await fetch(`https://api.vimeo.com/videos/${extractedVideoId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // Fetching the URL of the highest res image
    if (data && data.pictures && data.pictures.sizes && data.pictures.sizes.length > 0) {
      return data.pictures.sizes[data.pictures.sizes.length - 1].link; // Return the URL of the highest resolution image
    }
    
    return null;

  } catch (error) {
    console.error('Error fetching Vimeo video thumbnail: ', error);
    return null;
  }
};

export default getVideoThumbnail;
