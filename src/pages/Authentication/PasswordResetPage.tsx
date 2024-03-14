import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Auth, confirmPasswordReset } from 'firebase/auth';
// CSS
import './PasswordResetPage.css'; // Adjust the path as necessary
import { IonButton, IonContent, IonPage } from '@ionic/react';

interface Props {
  auth: Auth;
  actionCode: string | null;
}

const PasswordResetPage: React.FC<Props> = ({ auth, actionCode }: Props) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory();

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!actionCode) {
      setError('Invalid or expired reset link.');
      return;
    }

    try {
      console.log(newPassword);
      await confirmPasswordReset(auth, actionCode, newPassword);
      if (auth.currentUser) {
        auth.currentUser?.reload();
      }
      setSuccess('Your password has been reset successfully.');
      // Optionally, navigate to the login screen or elsewhere as needed
      // navigation.navigate('LoginScreen');
    } catch (error) {
      setError('Failed to reset password. Please try again.'); //Figure out a way to be more explicit
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className='password-reset-content'>
          <h2>Reset Your Password</h2>
          {error && <p className='error'>{error}</p>}
          {success && <p className='success'>{success}</p>}
          <input
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder='New Password'
            className='password-reset-input'
          />
          <input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confirm New Password'
            className='password-reset-input'
          />
          <IonButton onClick={handleResetPassword} className='reset-button'>
            Reset Password
          </IonButton>
          <a
            onClick={() => history.push('Authentication/Login')}
            className='login-link'
          >
            Return to Login
          </a>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PasswordResetPage;
