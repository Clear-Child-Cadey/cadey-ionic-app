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
} from '@revenuecat/purchases-capacitor';
import './PurchaseSub.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import useProAccessCheck from '../../hooks/useProAccessCheck';
import { useHistory, useLocation } from 'react-router';
import useDeviceFacts from '../../hooks/useDeviceFacts';
import useUserFacts from '../../hooks/useUserFacts';
import { useAppPage } from '../../context/AppPageContext';

const PurchaseSubPage = () => {
  const [loading, setLoading] = useState(true);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const { proAccessCheck } = useProAccessCheck();
  const dispatch = useDispatch();
  const history = useHistory();
  const { logDeviceFact } = useDeviceFacts();
  const { logUserFact } = useUserFacts();

  // Get the ID from the URL. The URL path will be /app/paths/PathDetail?id=123
  const location = useLocation(); // Get the current location object
  const searchParams = new URLSearchParams(location.search); // Create a URLSearchParams object from the search string
  const pageOnPurchase = String(searchParams.get('page'));
  const pathId = Number(searchParams.get('pathId')); // Get the value of the 'id' query parameter

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

    document.title = 'Purchase Subscription'; // Set the page title
    setCurrentBasePage('Purchase Subscription'); // Set the current base page
    setCurrentAppPage('Purchase Subscription'); // Set the current app page

    logUserFact({
      userFactTypeName: 'appPageNavigation',
      appPage: 'Purchase Subscription',
    });
  }, []);

  useEffect(() => {
    // Route the user to the correct location.
    // If the incoming URL contained an ID, re-route to path detail.
    // Otherwise, re-route to home.

    if (proStatus && pageOnPurchase == 'pathDetail' && pathId) {
      console.log('Routing to path detail');
      history.push('/App/Paths/PathDetail?id=' + pathId);
    } else if (proStatus) {
      console.log('Routing home');
      history.push('/App/Home');
    }
  }, [proStatus]);

  const handleInvalidate = async () => {
    const invalidateResult = await Purchases.invalidateCustomerInfoCache;
    console.log('invalidateResult: ', invalidateResult);
  };

  const handleRestore = async () => {
    const restoreResult = await Purchases.restorePurchases;
    console.log('restoreResult: ', restoreResult);
  };

  const handleManageAccount = async () => {
    history.push('/App/Account');
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Purchase a Subscription</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
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
        <IonButton onClick={handleInvalidate}>Invalidate</IonButton>
        <IonButton onClick={handleRestore}>Restore Purchases</IonButton>
        <IonButton onClick={handleManageAccount}>Manage my Account</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default PurchaseSubPage;
