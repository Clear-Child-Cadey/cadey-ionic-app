import { Capacitor } from '@capacitor/core';
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import AppMeta from '../../variables/AppMeta';

export const initializeRevenueCat = async () => {
  await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG }); // Debug log level
  // await Purchases.setLogLevel({ level: LOG_LEVEL.INFO }); // Production log level
  const platform = Capacitor.getPlatform();
  try {
    const apiKey =
      platform === 'ios'
        ? AppMeta.publicAppleRevenueCatApiKey
        : AppMeta.publicGoogleRevenueCatApiKey;
    await Purchases.configure({ apiKey });
    console.log('RevenueCat initialized');
  } catch (e) {
    console.log('RevenueCat initialization error', e);
  }
};
