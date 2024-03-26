import { useHistory } from 'react-router';
import { useModalContext } from '../context/ModalContext';
import { useTabContext } from '../context/TabContext';
import { getQuiz } from '../api/Quiz';
import AppMeta from '../variables/AppMeta';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import React from 'react';
import ApiUrlContext from '../context/ApiUrlContext';

interface Props {
  clientContext: number; //Where the user is in the app: 1 = VideoDetail, 2 = appopened, 3 = Onboarding sequence
  entityType: number; // 1 = video, 2 = article
  entityId: number; // The ID of the video or article
  shouldHaveEmailVerified?: boolean;
}

const useRequestQuiz = ({
  clientContext,
  entityType,
  entityId,
  shouldHaveEmailVerified = false,
}: Props) => {
  const { setQuizModalData, setQuizModalOpen } = useModalContext();
  const { setIsTabBarVisible } = useTabContext();
  const history = useHistory();
  const { apiUrl } = React.useContext(ApiUrlContext);
  const cadeyUserId = useSelector((state: RootState) =>
    state?.authStatus?.userData?.cadeyUser?.cadeyUserId
      ? state.authStatus.userData.cadeyUser.cadeyUserId
      : state.authStatus.appOpenCadeyId,
  ); // either grab the ID from cadey user, if set, otherwise, get the appOpen cadeyUserId

  const isVideoModal = entityType === 1;

  // Set email verification requirement based on where quiz is being rendered
  const emailVerified =
    shouldHaveEmailVerified && AppMeta.forceEmailVerification
      ? useSelector((state: RootState) => {
          return state.authStatus.emailVerified;
        })
      : true;

  const requestQuiz = async () => {
    if (emailVerified) {
      const quizResponse = await getQuiz(
        apiUrl,
        Number(cadeyUserId),
        clientContext,
        entityType, // Entity Type (1 = video)
        entityId, // Entity IDs (The ID of the video)
      );

      // setCheckForWelcome(true); // Prevents re-fetching the quiz hmmmmmmm...

      // If the user has not completed the welcome sequence, show the welcome page
      if (quizResponse.question !== null && quizResponse.question.id > 0) {
        // Set the quiz data
        setQuizModalData(quizResponse);

        if (isVideoModal) {
          //set quiz modal open
          setQuizModalOpen(true);
        } else {
          // Hide the tab bar
          setIsTabBarVisible(false);

          // Redirect user to Welcome sequence - Age group
          history.push('/App/Welcome/Path');
        }
      } else if (!isVideoModal) {
        // Show the tab bar and redirect to the home page
        setIsTabBarVisible(true);
        history.push('/App/Home');
      }
    }
  };

  return { requestQuiz };
};

export default useRequestQuiz;
