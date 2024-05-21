import { Capacitor } from '@capacitor/core';
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import AppMeta from '../../variables/AppMeta';

export const initializeRevenueCat = async () => {
  await Purchases.setLogLevel(LOG_LEVEL.DEBUG); // Debug log level
  // await Purchases.setLogLevel(LOG_LEVEL.INFO); // Production log level
  if (Capacitor.getPlatform() === 'ios') {
    await Purchases.configure({ apiKey: AppMeta.publicAppleRevenueCatApiKey });
  } else if (Capacitor.getPlatform() === 'android') {
    await Purchases.configure({ apiKey: AppMeta.publicGoogleRevenueCatApiKey });
  }
};
