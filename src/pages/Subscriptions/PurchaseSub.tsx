import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonButton, IonList } from '@ionic/react';
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
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null) {
          // Display current offering with offerings.current
          setOfferings(offerings);
        }
      } catch (error) {
        // Handle error
        console.error('Error fetching offerings:', error);
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

    if (proStatus && pageOnPurchase === 'pathDetail' && pathId) {
      console.log('Routing to path detail');
      history.push('/App/Paths/PathDetail?id=' + pathId);
    } else if (proStatus) {
      console.log('Routing home');
      history.push('/App/Home');
    }
  }, [proStatus]);

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
        // Unlock pro content
        proAccessCheck();

        // TODO: Log a user fact. Need details from Alex.
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
    <IonPage className='purchase-subscription-page'>
      <IonContent className='ion-padding'>
        <div className='subscription-content-wrapper'>
          <div className='subscription-page-header'>
            <img src='assets/svgs/checkmark-circle.svg' className='' />
            <h2>Your account is ready</h2>
            <h1>Unlock Cadey For Free</h1>
          </div>
          <div className='features-list'>
            <div className='feature-item'>
              <img src='assets/svgs/infinity.svg' className='feature-icon' />
              <span>Unlimited free access for 7 days</span>
            </div>
            <div className='feature-item'>
              <img src='assets/svgs/video-stack.svg' className='feature-icon' />
              <span>
                Learn parenting strategies in the moment with quick videos
              </span>
            </div>
            <div className='feature-item'>
              <img
                src='assets/svgs/message-bubble.svg'
                className='feature-icon'
              />
              <span>
                Weekly webinars and live Q & A with child psychologists
              </span>
            </div>
            <div className='feature-item'>
              <img src='assets/svgs/assessments.svg' className='feature-icon' />
              <span>Pinpoint your concern for your child with assessments</span>
            </div>
            <div className='feature-item'>
              <img src='assets/svgs/laptop.svg' className='feature-icon' />
              <span>
                Mini-lessons for parenting issues like hyperactivity and anxiety
              </span>
            </div>
          </div>

          <IonList>
            {offerings?.current?.availablePackages.map((pkg) => (
              <div className='subscribe-block' key={pkg.identifier}>
                <IonButton
                  expand='block'
                  className='purchase-subscription-button'
                  onClick={() => handlePurchase(pkg)}
                >
                  Try Free & Subscribe
                </IonButton>
                <p>
                  Totally free for 7 days, then {pkg.product.priceString}/month.
                  Cancel anytime.
                </p>
              </div>
            ))}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PurchaseSubPage;
