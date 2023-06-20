export const logVideoPlay = async (cadeyUserId: string, url: string, mediaId: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'apiKey': 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            userid: cadeyUserId,
            userFactTypeName: "StartedMedia",
            detail1: mediaId,
            detail2: "",
            detail3: "",
        }),
      };
  
      try {
        const recommendationsResponse = await fetch(url, requestOptions);
        const data = await recommendationsResponse.json();
        return data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
  }

  export const logVideoPause = async (cadeyUserId: string, url: string, mediaId: string, mediaProgress: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'apiKey': 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            userid: cadeyUserId,
            userFactTypeName: "PausedMedia",
            detail1: mediaId,
            detail2: mediaProgress,
            detail3: "",
        }),
      };
  
      try {
        const recommendationsResponse = await fetch(url, requestOptions);
        const data = await recommendationsResponse.json();
        return data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
  }

  export const logVideoProgress = async (cadeyUserId: string, url: string, mediaId: string, progress: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'apiKey': 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            userid: cadeyUserId,
            userFactTypeName: "InProgressMedia",
            detail1: mediaId,
            detail2: progress,
            detail3: "",
        }),
      };
  
      try {
        const recommendationsResponse = await fetch(url, requestOptions);
        const data = await recommendationsResponse.json();
        return data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
  }

  export const logVideoFinish = async (cadeyUserId: string, url: string, mediaId: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'apiKey': 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            userid: cadeyUserId,
            userFactTypeName: "FinishedMedia",
            detail1: mediaId,
            detail2: "",
            detail3: "",
        }),
      };
  
      try {
        const recommendationsResponse = await fetch(url, requestOptions);
        const data = await recommendationsResponse.json();
        return data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
  }
  
  // Log user response to false door question
  export const logFalseDoorResponse = async (cadeyUserId: string, url: string, falseDoorQuestionId: string, userResponse: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'apiKey': 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            userid: cadeyUserId,
            userFactTypeName: "FalseDoorQuestionResponse",
            detail1: falseDoorQuestionId, 
            detail2: userResponse,
            detail3: "",
        }),
      };
  
      try {
        const recommendationsResponse = await fetch(url, requestOptions);
        const data = await recommendationsResponse.json();
        return data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
  }