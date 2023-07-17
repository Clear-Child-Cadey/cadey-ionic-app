import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.cadey.liteapp',
  appName: 'CadeyLite',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    FacebookConnect: {
      APP_ID: "975686806801415",
      APP_NAME: "CadeyLite"
    }
  }
};

export default config;