import { IonButton } from '@ionic/react';
import './VerificationMessage.css';
interface Props {
  handleRedirectHome: () => void;
}
const VerificationPage = ({ handleRedirectHome }: Props) => {
  return (
    <div className='email-verification-message'>
      <h2>UH-OH!</h2>
      <p>Before you can continue, please verify your email address</p>
      <IonButton onClick={handleRedirectHome}>I already verified</IonButton>
    </div>
  );
};
export default VerificationPage;
