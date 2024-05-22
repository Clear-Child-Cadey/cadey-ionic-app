import { Purchases, CustomerInfo } from '@revenuecat/purchases-capacitor';
import { setProStatus } from '../../features/authLoading/slice';

export const checkEntitlementsAndUpdateUserStatus = async (dispatch: any) => {
  console.log('Checking entitlements...');

  try {
    const response = await Purchases.getCustomerInfo();
    const customerInfo: CustomerInfo = response.customerInfo; // Correctly accessing customerInfo

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
