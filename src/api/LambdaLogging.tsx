// Method to indicate that the app has been opened
export const appOpenedLambda = async (userId: string) => {
    const url = 'https://a47vhkjc3cup25cpotv37xvcj40depdu.lambda-url.us-west-2.on.aws/';
    const bodyObject = {
      user_id: userId,
      log_event: 'OPEN',
      data: ''
    };
    const requestOptions = {
      method: 'POST',
      headers: { 
        Accept: 'application/json', 
      },
      body: JSON.stringify(bodyObject)
    };
  
    try {
      const response = await fetch(url, requestOptions);
    } catch (error) {
      console.error('Error during API call', error);
    }
};

// Method to indicate a user has interacted with the app (notably selected a concern)
export const UserActivityLambda = async (userId: string, data: any = '') => {
    const url = 'https://a47vhkjc3cup25cpotv37xvcj40depdu.lambda-url.us-west-2.on.aws/';
    const bodyObject = {
      user_id: userId,
      log_event: 'ENTRY',
      data: data
    };
    const requestOptions = {
      method: 'POST',
      headers: { 
        Accept: 'application/json', 
      },
      body: JSON.stringify(bodyObject)
    };
  
    try {
      const response = await fetch(url, requestOptions);
    } catch (error) {
      console.error('Error during API call', error);
    }
};

// Method to indicate the user has submitted a query (notably selected a concern, symptoms, and age)
export const SubmitQueryLambda = async (userId: string, symptomIds: number[], ageGroup: number) => {
    const logSubmitUrl = 'https://a47vhkjc3cup25cpotv37xvcj40depdu.lambda-url.us-west-2.on.aws/';
    
    const logSubmitBodyObject = {
      user_id: userId,
      log_event: 'SUBMIT',
      data: {
        'Symptom IDs': symptomIds,
        'Age Group': ageGroup
      }
    };
    const logSubmitRequestOptions = {
      method: 'POST',
      headers: { 
        Accept: 'application/json', 
      },
      body: JSON.stringify(logSubmitBodyObject)
    };

    try {
      const logSubmitResponse = await fetch(logSubmitUrl, logSubmitRequestOptions);
    } catch (error) {
      console.error('Error during API call', error);
    }
};

// Method to indicate the user received a response
export const ReceivedResponseLambda = async (userId: string, symptomIds: number[], ageGroup: number, recommendationsResponse: any) => {
    const logResponseUrl = 'https://a47vhkjc3cup25cpotv37xvcj40depdu.lambda-url.us-west-2.on.aws/';
    
    const logResponseBodyObject = {
      user_id: userId,
      log_event: 'RESPONSE',
      data: {
        'UserInput': {
          'Symptom IDs': symptomIds,
          'Age Group': ageGroup
        },
        'Recommendations': recommendationsResponse
      }
    };
    const logResponseRequestOptions = {
      method: 'POST',
      headers: { 
        Accept: 'application/json', 
      },
      body: JSON.stringify(logResponseBodyObject)
    };

    try {
      const logResponseResponse = await fetch(logResponseUrl, logResponseRequestOptions);
    } catch (error) {
      console.error('Error during API call', error);
    }
};
