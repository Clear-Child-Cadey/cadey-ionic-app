import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.cadey.liteapp',
  appName: 'CadeyLite',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      launchFadeOutDuration: 1000,
    },
  },
};

export default config;