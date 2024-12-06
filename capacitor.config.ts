import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'RegisterAppQr',
  webDir: 'www',
  plugins: {
    BarcodeScanning: {}, // Si el plugin requiere configuración personalizada, agrégala aquí
  },
};

export default config;
