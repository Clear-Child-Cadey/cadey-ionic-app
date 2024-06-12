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
  IonText,
} from '@ionic/react';
import {
  Purchases,
  PurchasesOfferings,
  PurchasesPackage,
  PURCHASES_ERROR_CODE,
  CustomerInfo,
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
import OneSignal from 'onesignal-cordova-plugin';
import { requestNotificationPermission } from '../../api/OneSignal/RequestPermission';
import { format } from 'date-fns';

const AccountPage = () => {
  const [loading, setLoading] = useState(true);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [corporateUser, setCorporateUser] = useState(false);
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
      try {
        const offerings = await Purchases.getOfferings();
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

    document.title = 'Your Account'; // Set the page title
    setCurrentBasePage('Account'); // Set the current base page
    setCurrentAppPage('Account'); // Set the current app page

    logUserFact({
      userFactTypeName: 'appPageNavigation',
      appPage: 'Account',
    });
  }, []);

  useEffect(() => {
    if (
      cadeyUser != null &&
      cadeyUser.authStatus === 0 &&
      cadeyUser.companyName !== null
    ) {
      setCorporateUser(true);
    }
  }, [cadeyUser]);

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

  const handleManageSubscription = async () => {
    logDeviceFact({
      userFactTypeName: 'UserTap',
      appPage: 'Account',
      detail1: 'Account',
      detail2: 'Manage Subscription',
    });

    // Get the latest customerInfo
    const response = await Purchases.getCustomerInfo();
    const customerInfo: CustomerInfo = response.customerInfo;

    // Ensure managementURL exists
    if (customerInfo.managementURL) {
      window.location.href = customerInfo.managementURL;
    } else {
      console.error('Management URL is not available.');
    }
  };

  const handlePurchaseSubscription = async () => {
    history.push('/App/Account/Subscription/Purchase');
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

  const handleRestore = async () => {
    await Purchases.restorePurchases;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM do'); // e.g., "June 6th"
    // return format(date, "MM/dd/yy"); // e.g., "6/6/24"
  };

  const handleDeleteAccount = async () => {
    history.push('/App/Account/Delete');
  };

  return (
    <IonPage className='account-page'>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Your Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding account-content'>
        <div className='account-block preferences'>
          <h3>Email</h3>
          <p>{cadeyUser?.cadeyUserEmail}</p>
        </div>
        <div className='account-block'>
          <h3>Preferences</h3>
          <div className='account-preferences'>
            <p>Receive push notifications</p>
            <IonToggle
              checked={pushEnabled}
              onIonChange={togglePushNotifications}
              className='push-toggle'
            />
          </div>
        </div>
        <div className='account-block subscription'>
          <h3>Subscription</h3>
          <div className='account-subscription'>
            {corporateUser && <p>You have an active subscription</p>}

            {!corporateUser &&
            proEntitlementInfo &&
            proEntitlementInfo.willRenew ? (
              <p>
                Active, renews monthly at $9.99
                {proEntitlementInfo.expirationDate && (
                  <> on {formatDate(proEntitlementInfo.expirationDate)}</>
                )}
              </p>
            ) : (
              <>
                {!corporateUser &&
                  (proEntitlementInfo?.expirationDate ? (
                    <p>
                      Your subscription expires on{' '}
                      {formatDate(proEntitlementInfo.expirationDate)} and will
                      not renew
                    </p>
                  ) : (
                    <p>You do not have a subscription</p>
                  ))}
              </>
            )}

            {!corporateUser &&
              (proEntitlementInfo?.expirationDate ? (
                <div
                  onClick={handleManageSubscription}
                  className='manage-button'
                >
                  Manage
                </div>
              ) : (
                <div
                  onClick={handlePurchaseSubscription}
                  className='purchase-button'
                >
                  Purchase
                </div>
              ))}
          </div>
        </div>
        {/* <IonButton expand='block' onClick={handleContact}>
          Contact Us
        </IonButton> */}
        <div className='account-block'>
          <h3>Have questions?</h3>
          <p>
            Contact us at <a href='mailto:support@cadey.co'>support@cadey.co</a>
            .
          </p>
        </div>
        <div className='account-block account-actions'>
          <h3>Account Actions</h3>
          <p>
            <a onClick={handleRestore}>Restore Purchases</a>
          </p>
          <p>
            <a onClick={handleCadeyLogout}>Logout</a>
          </p>
          <p>
            <a onClick={handleDeleteAccount} className='delete-account'>
              Delete Account
            </a>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AccountPage;
