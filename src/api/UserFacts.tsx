export const logVideoPlay = async (cadeyUserId: string, url: string, mediaId: string, route: string) => {
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
            appPage: route,
            detail1: mediaId,
            detail2: "",
            detail3: "",
            detail4: "",
            detail5: "",
            detail6: "",
            detail7: "",
            detail8: "",
            detail9: "",
        }),
      };
  
      try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
  }

  export const logVideoPause = async (cadeyUserId: string, url: string, mediaId: string, mediaProgress: string, route: string) => {
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
            appPage: route,
            detail1: mediaId,
            detail2: mediaProgress,
            detail3: "",
            detail4: "",
            detail5: "",
            detail6: "",
            detail7: "",
            detail8: "",
            detail9: "",
        }),
      };
  
      try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
  }

  export const logVideoProgress = async (cadeyUserId: string, url: string, mediaId: string, progress: string, route: string) => {
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
            appPage: route,
            detail1: mediaId,
            detail2: progress,
            detail3: "",
            detail4: "",
            detail5: "",
            detail6: "",
            detail7: "",
            detail8: "",
            detail9: "",
        }),
      };
  
      try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
  }

  export const logVideoFinish = async (cadeyUserId: string, url: string, mediaId: string, route: string) => {
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
            appPage: route,
            detail1: mediaId,
            detail2: "",
            detail3: "",
            detail4: "",
            detail5: "",
            detail6: "",
            detail7: "",
            detail8: "",
            detail9: "",
        }),
      };
  
      try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
  }
  
  // Log user response to false door question
  export const logFalseDoorResponse = async (cadeyUserId: string, url: string, falseDoorQuestionId: string, userResponse: string, route: string) => {
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
            appPage: route,
            detail1: falseDoorQuestionId, 
            detail2: userResponse,
            detail3: "",
            detail4: "",
            detail5: "",
            detail6: "",
            detail7: "",
            detail8: "",
            detail9: "",
        }),
      };
  
      try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
  }

  export const logShareClick = async (cadeyUserId: string, url: string, mediaId: string, route: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'apiKey': 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            userid: cadeyUserId,
            userFactTypeName: "MediaShared",
            appPage: route,
            detail1: mediaId,
            detail2: "",
            detail3: "",
            detail4: "",
            detail5: "",
            detail6: "",
            detail7: "",
            detail8: "",
            detail9: "",
        }),
      };
  
      try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
  }

  export const logConcernClick = async (cadeyUserId: string, url: string, concernId: string, route: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'apiKey': 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            userid: cadeyUserId,
            userFactTypeName: "ConcernChosen",
            appPage: route,
            detail1: concernId,
            detail2: "",
            detail3: "",
            detail4: "",
            detail5: "",
            detail6: "",
            detail7: "",
            detail8: "",
            detail9: "",
        }),
      };
  
      try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
  }