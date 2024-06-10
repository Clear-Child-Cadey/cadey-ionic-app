import { useDispatch, useSelector } from 'react-redux';
import { Purchases, CustomerInfo } from '@revenuecat/purchases-capacitor';
import { RootState } from '../store';
import {
  setProEntitlementInfo,
  setProStatus,
} from '../features/authLoading/slice';
import { initializeRevenueCat } from '../api/RevenueCat/InitializeRevenueCat';

const useProAccessCheck = () => {
  const dispatch = useDispatch();
  const currentCadeyUser = useSelector(
    (state: RootState) => state.authStatus.userData.cadeyUser,
  );

  const proAccessCheck = async () => {
    // dispatch(setProStatus(true));

    if (currentCadeyUser == null) {
      // No user found, return
      return;
    }

    if (
      currentCadeyUser != null &&
      currentCadeyUser.authStatus === 0 &&
      currentCadeyUser.companyName !== null
    ) {
      // Corporate user found - grant pro status and return
      dispatch(setProStatus(true));
      return;
    }

    // If RevenueCat isn't initialized, initialize it
    if (!Purchases.isConfigured()) {
      {
        currentCadeyUser &&
          currentCadeyUser.oneSignalId &&
          (await initializeRevenueCat(currentCadeyUser.oneSignalId.toString()));
      }
    }

    try {
      const response = await Purchases.getCustomerInfo();
      const customerInfo: CustomerInfo = response.customerInfo;

      if (customerInfo.entitlements.active['Pro']) {
        // RevenueCat permission found - grant Pro status
        dispatch(setProStatus(true));
        dispatch(
          setProEntitlementInfo(customerInfo.entitlements.active['Pro']),
        );
      } else {
        // RevenueCat permission not found
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
