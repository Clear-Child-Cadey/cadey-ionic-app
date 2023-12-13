const API_KEY = 'XPRt31RRnMb7QNqyC5JfTZjAUTtWFkYU5zKYJ3Ck';
import { QuizResponse } from '../components/Modals/QuizModal/QuizModal';

export const getQuiz = async (
    apiUrl: string, 
    cadeyUserId: number, 
    clientContext: number,  // Where the user is in the app
                                // 1 = VideoDetail
    entityType: number,     // 1 = video, 2 = article
    entityId: number        // The ID of the video or article
) => {
    const url = `${apiUrl}/quiz`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'accept': 'text/plain',
            'apiKey': API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cadeyUserId: cadeyUserId,
            clientContext: clientContext,
            entityType: entityType,
            entityId: entityId,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};

export const postQuizResponse = async (
    apiUrl: string, 
    cadeyUserId: number, 
    clientContext: number,
    entityId: number,
    entityType: number,
    quizId: number,
    questionId: number,
    questionWasSkipped: boolean,
    quizWasCancelled: boolean,
    responses: QuizResponse[]
) => {
    
    const url = `${apiUrl}/quizquestionresponse`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'accept': 'text/plain',
            'apiKey': API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quizRequest: {
                cadeyUserId: cadeyUserId,
                clientContext: clientContext,
                entityType: entityType,
                entityId: entityId,
            },
            cadeyUserId: cadeyUserId,
            quizId: quizId,
            questionId: questionId,
            questionWasSkipped: questionWasSkipped,
            quizWasCancelled: quizWasCancelled,
            responses: responses,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};