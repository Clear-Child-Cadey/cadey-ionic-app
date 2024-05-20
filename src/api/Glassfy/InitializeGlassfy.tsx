import { Glassfy } from 'capacitor-plugin-glassfy';

export const initializeGlassfy = async () => {
  console.log('Initializing Glassfy 2...');
  try {
    await Glassfy.initialize({
      apiKey: '3eb6c432ec3b418db4fe98c3dffb5fb2',
      watcherMode: false, // Set to true if you want to use the watcher mode
    });
    console.log('Glassfy initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Glassfy:', error);
  }
};
