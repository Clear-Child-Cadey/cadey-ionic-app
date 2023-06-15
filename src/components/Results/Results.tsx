// Results.tsx
import React, { useState } from 'react';
import { 
  IonButton,
  IonText,
  IonRow,
  IonIcon
} from '@ionic/react';
import './Results.css';
import { refresh } from 'ionicons/icons';
import VideoList from '../Videos/VideoList';
import FalseDoorModal from '../Modals/FalseDoorModal/FalseDoorModal';

// Define the ResultsProps interface
interface ResultsProps {
  results: {
    recommendations: {
      title: string;
      showMeHow: {
        audience: string;
        mediaType: number;
        title: string;
        description: string | null;
        sourceUrl: string | null;
        thumbnail: string | null;
        sourceId: string;
      }[];
      tellMeHow: {
        text: string;
      }[];
    }[];
  };
  selectedConcern: string;
  onRestart: () => void;
}
// Define the Results component
// The results data originates in the AgeForm component and is passed to the main Concerns page, then here
const Results: React.FC<ResultsProps> = ({ results, selectedConcern, onRestart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Control the modal visibility
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false); // Control the visibility of the confirmation message
  const [userResponse, setUserResponse] = useState<'yes' | 'no' | null>(null); // Store the user's response
  
  const handleVideoPause = () => {
    // setIsModalOpen(true); // Open the modal when the video is paused
  };

  const handleVideoEnd = () => {
    // setIsModalOpen(true); // Open the modal when the video ends
  };

  const handleUserResponse = (userResponse: boolean) => {
    console.log('User response is', userResponse);
    // TODO: Update this to send data to the API with the following:
    // - User ID
    // - False Door ID
    // - User response (true/false)
  };

  return (
    <div className="container recommendations">
      <IonRow>
        <IonText className="subcopy">Here are a few suggestions, based on your concerns about {selectedConcern}</IonText>
      </IonRow>
      <IonRow>
        {results.recommendations.map((recommendation, index) => (
          <div key={index} className="recommendation">
            <hr />
            <h2>{recommendation.title}</h2>
            {recommendation.showMeHow.length > 0 && (
              <>
                <h3>Show Me How</h3>
                <VideoList 
                  videos={recommendation.showMeHow.map(video => ({
                    title: video.title,
                    audience: video.audience || 'No Description',
                    videoId: video.sourceId,
                  }))}
                  onVideoPause={handleVideoPause}
                  onVideoEnd={handleVideoEnd}
                />
              </>
            )}
            <h3>Tell Me How</h3>
            <ul>
              {recommendation.tellMeHow.map((item, index) => (
                <li key={index}>{item.text}</li>
              ))}
            </ul>
          </div>
        ))}
      </IonRow>
      <IonRow class="bottom-row single-button">
        <IonButton expand="block" onClick={onRestart} color="primary" aria-label="Restart">
          <IonIcon icon={refresh} slot="start" />
          Restart
        </IonButton>
      </IonRow>
      <FalseDoorModal 
        iconUrl="https://upload.wikimedia.org/wikipedia/commons/b/bd/Test.svg"
        copy="Question goes here"
        yesResponse="Yes, sign me up!"
        noResponse="No thanks, not interested"
        thankYouIconUrl="https://upload.wikimedia.org/wikipedia/commons/b/bd/Test.svg"
        thankYouCopy="Thank you for your interest in the Two Week Challenge!"
        thankYouButtonText="Back to Recommendations"
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onUserResponse={handleUserResponse}
      />
      {isConfirmationVisible && (
        <div className="confirmation-message">
          You selected: {userResponse}
        </div>
      )}
    </div>
  );
};

export default Results;