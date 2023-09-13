export const logVideoPlay = async (cadeyUserId: string, url: string, mediaId: string, mediaType: string, route: string) => {
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
        appPage: document.title,
        detail1: mediaId,
        detail2: mediaType,
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

export const logVideoPause = async (cadeyUserId: string, url: string, mediaId: string, mediaProgress: string, mediaType: string, route: string) => {
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
          appPage: document.title,
          detail1: mediaId,
          detail2: mediaProgress,
          detail3: mediaType,
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

export const logVideoProgress = async (cadeyUserId: string, url: string, mediaId: string, progress: string, videoType: string, route: string) => {
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
          appPage: document.title,
          detail1: mediaId,
          detail2: progress,
          detail3: videoType,
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

export const logVideoFinish = async (cadeyUserId: string, url: string, mediaId: string, mediaType: string, route: string) => {
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
          appPage: document.title,
          detail1: mediaId,
          detail2: mediaType,
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
          appPage: document.title,
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

export const logShareClick = async (cadeyUserId: string, url: string, mediaId: string, mediaType: string, route: string) => {
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
          appPage: document.title,
          detail1: mediaId,
          detail2: mediaType,
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
          appPage: document.title,
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

export const logFeaturedVideoNotificationClicked = async (cadeyUserId: string, url: string, mediaId: string, sourceId: string, route: string) => {
  const requestOptions = {
      method: 'POST',
      headers: {
        'accept': 'text/plain',
        'apiKey': 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "FeaturedVideoNotificationClicked",
          appPage: document.title,
          detail1: mediaId,
          detail2: sourceId,
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

export const logAgeScreenReached = async (cadeyUserId: string, url: string, route: string) => {
  const requestOptions = {
      method: 'POST',
      headers: {
        'accept': 'text/plain',
        'apiKey': 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "AgePageEntered",
          appPage: document.title,
          detail1: "",
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

export const logMessageOnMessagesPageClicked = async (cadeyUserId: string, url: string, mediaId: string, mediaSourceId: string, route: string) => {
  const requestOptions = {
      method: 'POST',
      headers: {
        'accept': 'text/plain',
        'apiKey': 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "MessageClickedOnMessagesPage",
          appPage: document.title,
          detail1: mediaId,
          detail2: mediaSourceId,
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

export const logTapBarClick = async (cadeyUserId: string, url: string, tabName: string, route: string) => {
  const requestOptions = {
      method: 'POST',
      headers: {
        'accept': 'text/plain',
        'apiKey': 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "TapBarNavClick",
          appPage: document.title,
          detail1: tabName,
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

export const logOpenedArticle = async (cadeyUserId: string, url: string, wordpressArticleId: number, route: string) => {
  const requestOptions = {
      method: 'POST',
      headers: {
        'accept': 'text/plain',
        'apiKey': 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
          userid: cadeyUserId,
          userFactTypeName: "OpenedArticle",
          appPage: document.title,
          detail1: wordpressArticleId.toString(),
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