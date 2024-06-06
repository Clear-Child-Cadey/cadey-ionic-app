import { Capacitor } from '@capacitor/core';
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import AppMeta from '../../variables/AppMeta';

export const initializeRevenueCat = async (externalId: string) => {
  // Ensure we have a valid externalId
  if (!externalId || externalId === '' || externalId === null) {
    console.error('Invalid RevenueCat externalId: ', externalId);
    return;
  }

  // await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG }); // Debug log level
  await Purchases.setLogLevel({ level: LOG_LEVEL.INFO }); // Production log level
  const platform = Capacitor.getPlatform();
  try {
    const apiKey =
      platform === 'ios'
        ? AppMeta.publicAppleRevenueCatApiKey
        : AppMeta.publicGoogleRevenueCatApiKey;
    await Purchases.configure({
      apiKey: apiKey,
    });
    await Purchases.logIn({ appUserID: externalId });
    console.log('RevenueCat initialized');
    console.log('Purchases configuration: ', Purchases.isConfigured());
  } catch (e) {
    console.log('RevenueCat initialization error', e);
  }
};
