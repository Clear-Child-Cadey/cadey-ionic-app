import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../api/Firebase/InitializeFirebase'; // Adjust the path as necessary
// CSS
import './PasswordReset.css'; // Adjust the path as necessary

const ResetPasswordScreen = () => {
  const location = useLocation();
  const oobCode = new URLSearchParams(location.search).get('oobCode');

  useEffect(() => {
    console.log(oobCode);
  }, []);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!oobCode) {
      setError('Invalid or expired reset link.');
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess('Your password has been reset successfully.');
      // Optionally, navigate to the login screen or elsewhere as needed
      // navigation.navigate('LoginScreen');
    } catch (error) {
      setError('Failed to reset password. Please try again.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Reset Your Password</h2>
      {error && <p className='error'>{error}</p>}
      {success && <p className='success'>{success}</p>}
      <input
        type='password'
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder='New Password'
      />
      <input
        type='password'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder='Confirm New Password'
      />
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
};

export default ResetPasswordScreen;
