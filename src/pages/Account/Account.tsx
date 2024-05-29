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

const AccountPage = () => {
  const [loading, setLoading] = useState(true);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
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

  const { setCurrentBasePage, setCurrentAppPage } = useAppPage();

  useEffect(() => {
    const fetchOfferings = async () => {
      console.log('Fetching offerings...');
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

    document.title = 'Account'; // Set the page title
    setCurrentBasePage('Account'); // Set the current base page
    setCurrentAppPage('Account'); // Set the current app page

    logUserFact({
      userFactTypeName: 'appPageNavigation',
      appPage: 'Account',
    });
  }, []);

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
        <div>
          {proStatus ? (
            <p>You have permission to access premium content</p>
          ) : (
            <p>You do not have permission to access premium content</p>
          )}
        </div>
        <IonButton expand='block' onClick={handleCadeyLogout}>
          Log Out
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AccountPage;
