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
} from '@revenuecat/purchases-capacitor';
import './Account.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import useProAccessCheck from '../../hooks/useProAccessCheck';
import useCadeyAuth from '../../hooks/useCadeyAuth';

const AccountPage = () => {
  const [loading, setLoading] = useState(true);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const { proAccessCheck } = useProAccessCheck();
  const dispatch = useDispatch();

  const { handleCadeyLogout } = useCadeyAuth();

  const proStatus = useSelector(
    (state: RootState) => state.authStatus.proStatus,
  );

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
  }, []);

  useEffect(() => {
    console.log('Offerings:', offerings);
  }, [offerings]);

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
        proAccessCheck();
      }
    } catch (error: any) {
      if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        // Purchase cancelled
        console.log('Purchase cancelled');
      } else {
        // Error making purchase
        console.error('Error making purchase:', error);
      }
    }
  };

  const handlePause = () => {
    // Logic to pause subscription
    console.log('Pause subscription');
  };

  const handleCancel = () => {
    // Logic to cancel subscription
    console.log('Cancel subscription');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Account</IonTitle>
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
        <IonButton expand='block' onClick={handlePause}>
          Pause Subscription
        </IonButton>
        <IonButton expand='block' onClick={handleCancel}>
          Cancel Subscription
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
