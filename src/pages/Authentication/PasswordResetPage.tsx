import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Auth, confirmPasswordReset, AuthError } from 'firebase/auth';
// CSS
import './PasswordResetPage.css'; // Adjust the path as necessary
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar,
} from '@ionic/react';
import useDeviceFacts from '../../hooks/useDeviceFacts';
import getDeviceId from '../../utils/getDeviceId';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';

interface Props {
  auth: Auth;
  actionCode: string | null;
}

const PasswordResetPage: React.FC<Props> = ({ auth, actionCode }: Props) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory();
  const { logDeviceFact } = useDeviceFacts();
  const deviceId = getDeviceId();

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
      await confirmPasswordReset(auth, actionCode, newPassword);
      setSuccess('Your password has been reset successfully.');
      logDeviceFact({
        userFactTypeName: 'PasswordResetAttempt',
        appPage: 'Password Reset',
        detail1: 'Success', // Firebase status
      });

      // Optionally, navigate to the login screen or elsewhere as needed
    } catch (error) {
      if ((error as AuthError).code) {
        // Assuming `error` is of type `AuthError` which includes a `code` property
        const errorCode = (error as AuthError).code;
        const errorMessage = (error as AuthError).message;

        setError(`Failed to reset password: ${errorMessage}`);
        logDeviceFact({
          userFactTypeName: 'PasswordResetAttempt',
          appPage: 'Password Reset',
          detail1: 'Error',
          detail2: errorCode, // Using the error code from Firebase error
          detail3: errorMessage, // Using the error message from Firebase error
        });
      } else {
        // Handle unexpected errors that don't match the Firebase error structure
        setError('Failed to reset password. Please try again.');
        logDeviceFact({
          userFactTypeName: 'PasswordResetAttempt',
          appPage: 'Password Reset',
          detail1: 'Error',
          detail2: 'Unknown error',
        });
      }
    }
  };

  return (
    <IonPage>
      <IonHeader class='header'>
        <IonToolbar className='header-toolbar'>
          <h2>&nbsp;</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='password-reset-content'>
          <h2>Reset Your Password</h2>
          {error && <p className='error'>{error}</p>}
          {success ? (
            <>
              <p className='success'>{success}</p>
              <p className='additional-success'>
                Please click the link below to login.
              </p>
            </>
          ) : (
            <>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder='New Password'
                className='password-reset-input'
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Confirm New Password'
                className='password-reset-input'
              />
              {showPassword ? (
                <a
                  className='toggle-password off'
                  onClick={() => setShowPassword(false)}
                >
                  <IonIcon icon={eyeOffOutline} className='eye-icon off' />
                  <span>Hide</span>
                </a>
              ) : (
                <a
                  className='toggle-password on'
                  onClick={() => setShowPassword(true)}
                >
                  <IonIcon icon={eyeOutline} className='eye-icon on' />
                  <span>Show</span>
                </a>
              )}
              <IonButton onClick={handleResetPassword} className='reset-button'>
                Reset Password
              </IonButton>
            </>
          )}
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
