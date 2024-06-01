import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
} from '@ionic/react';
import {
  Purchases,
  PurchasesOfferings,
  PurchasesPackage,
  PURCHASES_ERROR_CODE,
  CustomerInfo,
  PurchasesEntitlementInfo,
} from '@revenuecat/purchases-capacitor';
import './Account.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import useProAccessCheck from '../../hooks/useProAccessCheck';
import useCadeyAuth from '../../hooks/useCadeyAuth';
import { useHistory } from 'react-router';
import useDeviceFacts from '../../hooks/useDeviceFacts';
import useUserFacts from '../../hooks/useUserFacts';
import { useAppPage } from '../../context/AppPageContext';
import { setProEntitlementInfo } from '../../features/authLoading/slice';
import OneSignal from 'onesignal-cordova-plugin';
import { requestNotificationPermission } from '../../api/OneSignal/RequestPermission';

const AccountPage = () => {
  const [loading, setLoading] = useState(true);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [pushEnabled, setPushEnabled] = useState(false);
  const { proAccessCheck } = useProAccessCheck();
  const dispatch = useDispatch();
  const history = useHistory();
  const { logDeviceFact } = useDeviceFacts();
  const { logUserFact } = useUserFacts();

  const { handleCadeyLogout } = useCadeyAuth();

  const cadeyUser = useSelector(
    (state: RootState) => state.authStatus.userData.cadeyUser,
  );

  const proStatus = useSelector(
    (state: RootState) => state.authStatus.proStatus,
  );

  const proEntitlementInfo = useSelector(
    (state: RootState) => state.authStatus.proEntitlementInfo,
  );

  const { setCurrentBasePage, setCurrentAppPage } = useAppPage();

  useEffect(() => {
    const fetchOfferings = async () => {
      console.log('Fetching offerings...');
      try {
        const offerings = await Purchases.getOfferings();
        console.log('Offerings:', offerings);
        if (offerings.current !== null) {
          // Display current offering with offerings.current
          setOfferings(offerings);
        }
        setLoading(false);
      } catch (error) {
        // Handle error
        console.error('Error fetching offerings:', error);
        setLoading(false);
      }
    };

    proAccessCheck();
    fetchOfferings();
    pushNotificationCheck();

    document.title = 'Account'; // Set the page title
    setCurrentBasePage('Account'); // Set the current base page
    setCurrentAppPage('Account'); // Set the current app page

    logUserFact({
      userFactTypeName: 'appPageNavigation',
      appPage: 'Account',
    });
  }, []);

  const pushNotificationCheck = async () => {
    // Check if the app is running in a browser or on a device | Set the OneSignal external ID
    if (window.cordova) {
      OneSignal.getDeviceState((deviceState) => {
        if (deviceState.hasNotificationPermission) {
          if (deviceState.pushDisabled === true) {
            setPushEnabled(false);
          } else if (deviceState.pushDisabled === false) {
            setPushEnabled(true);
          }
        }
        console.log(deviceState);
      });
    }
  };

  const togglePushNotifications = () => {
    // Check if the app is running in a browser or on a device
    if (window.cordova) {
      OneSignal.getDeviceState((deviceState) => {
        if (deviceState.hasNotificationPermission) {
          OneSignal.disablePush(pushEnabled);
          setPushEnabled(!pushEnabled);
          OneSignal.getDeviceState((deviceState) => {
            console.log(deviceState);
          });
        } else {
          requestNotificationPermission();
        }
      });
    } else {
      // Don't interact with OneSignal (which relies on Cordova)
    }
  };

  const handlePurchase = async (packageToBuy: PurchasesPackage) => {
    console.log('Purchasing...', packageToBuy);
    try {
      const purchaseResult = await Purchases.purchasePackage({
        aPackage: packageToBuy,
      });
      if (
        typeof purchaseResult.customerInfo.entitlements.active['Pro'] !==
        'undefined'
      ) {
        // Unlock that great "pro" content
        console.log('Permission granted - unlock Pro!');
        // TODO: Log a user fact. Need details from Alex.
        proAccessCheck();
      }
    } catch (error: any) {
      if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        // Purchase cancelled
        console.log('Purchase cancelled');
        // TODO: Log a user fact. Need details from Alex.
      } else {
        // Error making purchase
        console.error('Error making purchase:', error);
        // TODO: Log a user fact. Need details from Alex.
      }
    }
  };

  const handleManageSubscription = async () => {
    // Logic to manage subscription
    console.log('Manage subscription');

    logDeviceFact({
      userFactTypeName: 'UserTap',
      appPage: 'Account',
      detail1: 'Account',
      detail2: 'Manage Subscription',
    });

    // Get the latest customerInfo
    const response = await Purchases.getCustomerInfo();
    const customerInfo: CustomerInfo = response.customerInfo;

    console.log('Customer info:', customerInfo);

    // Ensure managementURL exists
    if (customerInfo.managementURL) {
      // Route to the customerInfo.managementURL
      history.push(customerInfo.managementURL);
    } else {
      console.error('Management URL is not available.');
    }
  };

  const handleContact = () => {
    logDeviceFact({
      userFactTypeName: 'UserTap',
      appPage: 'Account',
      detail1: 'Account',
      detail2: 'Contact Us',
    });
    history.push('/App/Account/Contact');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        {cadeyUser && <IonLabel>Email: {cadeyUser.cadeyUserEmail}</IonLabel>}
        {loading ? (
          <p>Loading offerings...</p>
        ) : (
          <IonList>
            {offerings?.current?.availablePackages.map((pkg) => (
              <IonItem key={pkg.identifier}>
                <IonLabel>
                  <h2>{pkg.product.title}</h2>
                  <p>{pkg.product.description}</p>
                  <IonButton expand='block' onClick={() => handlePurchase(pkg)}>
                    Purchase {pkg.product.title} for {pkg.product.priceString}
                  </IonButton>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
        <IonButton expand='block' onClick={handleManageSubscription}>
          Manage Subscription
        </IonButton>
        <IonButton expand='block' onClick={handleContact}>
          Contact Us
        </IonButton>
        {proStatus ? (
          <p>You have permission to access premium content.</p>
        ) : (
          <p>You do not have permission to access premium content</p>
        )}
        {proEntitlementInfo && (
          <>
            <p>Last purchased on: {proEntitlementInfo.latestPurchaseDate}</p>
            {proEntitlementInfo.willRenew && (
              <p>Renewal date: {proEntitlementInfo.expirationDate}</p>
            )}
          </>
        )}
        <IonItem>
          <IonLabel>Push Notifications:</IonLabel>
          <IonToggle
            checked={pushEnabled}
            onIonChange={togglePushNotifications}
          />
        </IonItem>
        <IonButton expand='block' onClick={handleCadeyLogout}>
          Log Out
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AccountPage;
