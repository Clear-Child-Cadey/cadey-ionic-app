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
  PurchasesOfferings, // Types for TypeScript
} from '@revenuecat/purchases-capacitor';
import './Account.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const AccountPage = () => {
  const [loading, setLoading] = useState(true);
  // const permissionStatus = useSelector(
  //   (state: RootState) => state.authStatus.proAccessStatus,
  // );
  const [permissionStatus, setPermissionStatus] = useState(false);

  useEffect(() => {
    const fetchOfferings = async () => {
      console.log('Fetching offerings...');
    };

    fetchOfferings();
  }, []);

  const handlePurchase = async () => {
    console.log('Purchasing...');
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
          // <IonList>
          //   {offerings.map((offering) => (
          //     <IonItem key={offering.offeringId}>
          //       <IonLabel>
          //         <h2>{offering.offeringId}</h2>
          //         <IonList>
          //           {offering.skus.map((sku: GlassfySku) => (
          //             <IonItem key={sku.product.identifier}>
          //               <IonLabel>
          //                 <h3>{sku.product.title}</h3>
          //                 <p>{sku.product.description}</p>
          //                 <IonButton
          //                   expand='block'
          //                   onClick={() => handlePurchase(sku)}
          //                 >
          //                   Purchase {sku.product.title} for $
          //                   {sku.product.price} per {sku.product.period}
          //                 </IonButton>
          //               </IonLabel>
          //             </IonItem>
          //           ))}
          //         </IonList>
          //       </IonLabel>
          //     </IonItem>
          //   ))}
          // </IonList>
        )}
        <IonButton expand='block' onClick={handlePause}>
          Pause Subscription
        </IonButton>
        <IonButton expand='block' onClick={handleCancel}>
          Cancel Subscription
        </IonButton>
        <div>
          {permissionStatus ? (
            <p>You have permission to access premium content</p>
          ) : (
            <p>You do not have permission to access premium content</p>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AccountPage;
