import Config from 'react-native-config';

/**
 * All sensitive or environment-specific values are read from the .env file
 * via react-native-config and never hardcoded in source.
 *
 * Add new keys to:
 *   1. .env              (your local values — git-ignored)
 *   2. .env.example      (placeholder for teammates)
 *   3. declarations.d.ts NativeConfig interface (TypeScript type safety)
 */

/** Backend REST API base URL. */
export const API_BASE_URL: string = Config.API_BASE_URL;

/** MQTT broker URL used during device provisioning. */
export const MQTT_BROKER_URL: string = Config.MQTT_BROKER_URL;

/** IP address of the device's SoftAP during the provisioning flow. */
export const DEVICE_AP_HOST: string = Config.DEVICE_AP_HOST;

/** TCP port the device listens on during provisioning. */
export const DEVICE_AP_PORT: number = Number(Config.DEVICE_AP_PORT);

/** MMKV encryption key — supplied from .env, never hardcoded. */
export const MMKV_ENCRYPTION_KEY: string = Config.MMKV_ENCRYPTION_KEY;
