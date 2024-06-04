import { useDispatch, useSelector } from 'react-redux';
import {
  Purchases,
  CustomerInfo,
  PurchasesEntitlementInfo,
} from '@revenuecat/purchases-capacitor';
import { RootState } from '../store';
import {
  setProEntitlementInfo,
  setProStatus,
} from '../features/authLoading/slice';
import { initializeRevenueCat } from '../api/RevenueCat/InitializeRevenueCat';
import { current } from '@reduxjs/toolkit';

const useProAccessCheck = () => {
  const dispatch = useDispatch();
  const currentCadeyUser = useSelector(
    (state: RootState) => state.authStatus.userData.cadeyUser,
  );

  const proAccessCheck = async () => {
    // dispatch(setProStatus(true));

    if (currentCadeyUser == null) {
      console.log('Cadey user not found - leaving proAccessCheck!');
      return;
    }

    if (
      currentCadeyUser != null &&
      currentCadeyUser.authStatus === 0 &&
      currentCadeyUser.companyName !== null
    ) {
      console.log('Cadey corporate user found! Granting pro access...');
      dispatch(setProStatus(true));
      return;
    }

    // If RevenueCat isn't initialized, initialize it
    if (!Purchases.isConfigured()) {
      console.log('RevenueCat not initialized - initializing...');
      {
        currentCadeyUser &&
          currentCadeyUser.oneSignalId &&
          (await initializeRevenueCat(currentCadeyUser.oneSignalId.toString()));
      }
    }

    try {
      console.log('Current Cadey User: ', currentCadeyUser);

      const response = await Purchases.getCustomerInfo();
      const customerInfo: CustomerInfo = response.customerInfo;

      // Access the latest customerInfo
      console.log('Customer info:', customerInfo);
      console.log('Entitlements:', customerInfo.entitlements);

      if (customerInfo.entitlements.active['Pro']) {
        console.log('Permission granted! Granting pro access...');
        dispatch(setProStatus(true));
        dispatch(
          setProEntitlementInfo(customerInfo.entitlements.active['Pro']),
        );
        console.log(
          'Pro entitlement info: ',
          customerInfo.entitlements.active['Pro'],
        );
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
