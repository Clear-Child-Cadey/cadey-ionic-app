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
  Glassfy,
  GlassfyOffering,
  GlassfySku,
  GlassfyPermission,
} from 'capacitor-plugin-glassfy';
import './Account.css';

const AccountPage = () => {
  const [offerings, setOfferings] = useState<GlassfyOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<GlassfyPermission[]>([]);
  const [permissionStatus, setPermissionStatus] = useState(false);

  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        console.log('Fetching offerings...');
        const result = await Glassfy.offerings();
        console.log('Offerings:', result);
        setOfferings(result.all);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching offerings:', error);
        setLoading(false);
      }
    };

    fetchOfferings();
    checkGlassfyPermissions();
  }, []);

  const checkGlassfyPermissions = async () => {
    try {
      const permissions = await Glassfy.permissions();
      setPermissions(permissions.all);
      permissions.all.forEach((p) => {
        switch (p.permissionId) {
          case 'pro_features':
            if (p.isValid) {
              setPermissionStatus(true);
            } else {
              console.log('Permission not valid:', p);
            }
            break;

          default:
            break;
        }
      });
    } catch (e) {
      console.error('Error fetching permissions:', e);
    }
  };

  const handlePurchase = async (sku: GlassfySku) => {
    try {
      const transaction = await Glassfy.purchaseSku({ sku: sku });
      console.log('Purchase successful: ', transaction);
    } catch (error) {
      console.error('Purchase error:', error);
    }

    checkGlassfyPermissions();
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
            {offerings.map((offering) => (
              <IonItem key={offering.offeringId}>
                <IonLabel>
                  <h2>{offering.offeringId}</h2>
                  <IonList>
                    {offering.skus.map((sku: GlassfySku) => (
                      <IonItem key={sku.product.identifier}>
                        <IonLabel>
                          <h3>{sku.product.title}</h3>
                          <p>{sku.product.description}</p>
                          <IonButton
                            expand='block'
                            onClick={() => handlePurchase(sku)}
                          >
                            Purchase {sku.product.title} for $
                            {sku.product.price} per {sku.product.period}
                          </IonButton>
                        </IonLabel>
                      </IonItem>
                    ))}
                  </IonList>
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
