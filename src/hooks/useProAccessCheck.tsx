import { useDispatch, useSelector } from 'react-redux';
import { Purchases, CustomerInfo } from '@revenuecat/purchases-capacitor';
import { RootState } from '../store';
import { setProStatus } from '../features/authLoading/slice';
import { useEffect } from 'react';

const useProAccessCheck = () => {
  const dispatch = useDispatch();
  const currentCadeyUser = useSelector(
    (state: RootState) => state.authStatus.userData.cadeyUser,
  );

  useEffect(() => {
    console.log(
      'Current Cadey user (useProAccessCheck.tsx useEffect):',
      currentCadeyUser,
    );
  }, [currentCadeyUser]);

  const proAccessCheck = async () => {
    console.log('Checking Cadey user status...');
    console.log(
      'Current Cadey user (useProAccessCheck.tsx):',
      currentCadeyUser,
    );

    if (
      currentCadeyUser != null &&
      currentCadeyUser.authStatus === 0 &&
      currentCadeyUser.companyName !== null
    ) {
      console.log('Cadey corporate user found! Granting pro access...');
      dispatch(setProStatus(true));
      return;
    }

    console.log('Checking entitlements...');

    try {
      const response = await Purchases.getCustomerInfo();
      const customerInfo: CustomerInfo = response.customerInfo;

      // Access the latest customerInfo
      console.log('Customer info:', customerInfo);
      console.log('Entitlements:', customerInfo.entitlements);

      if (customerInfo.entitlements.active['Pro']) {
        console.log('Permission granted - unlock Pro!');
        dispatch(setProStatus(true));
      } else {
        console.log('Permission not granted - show paywall?');
        dispatch(setProStatus(false));
      }
    } catch (error) {
      console.error('Error fetching customer info:', error);
    }
  };

  return {
    proAccessCheck,
  };
};

export default useProAccessCheck;
