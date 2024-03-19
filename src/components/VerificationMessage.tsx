import { IonButton } from '@ionic/react';
import './VerificationMessage.css';
import AppMeta from '../variables/AppMeta';
interface Props {
  handleRedirectHome: () => void;
}
const VerificationPage = ({ handleRedirectHome }: Props) => {
  return (
    <div className='email-verification-message'>
      <h2>Great! Now, check your email</h2>
      <p>{AppMeta.emailVerificationMessage}</p>
      <IonButton onClick={handleRedirectHome}>I already verified</IonButton>
    </div>
  );
};
export default VerificationPage;
