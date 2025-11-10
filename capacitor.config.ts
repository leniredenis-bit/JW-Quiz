import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jwquiz.app',
  appName: 'Quiz Bíblico JW',
  webDir: './',
  server: {
    androidScheme: 'https',
    // Permite que o app funcione offline
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a2e',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
      androidSplashResourceName: 'splash',
      iosSplashResourceName: 'splash'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1a1a2e'
    }
  }
};

export default config;
