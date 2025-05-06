import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ydms.leaderinyou.vn',
  appName: 'YDMS',
  webDir: 'www',
  ios: {
    preferredContentMode: 'mobile'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
