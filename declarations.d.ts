declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
}

declare module "*.json" {
    const value: object;
    export default value;
}

declare module "react-native-config" {
    export interface NativeConfig {
        API_BASE_URL: string;
        MQTT_BROKER_URL: string;
        DEVICE_AP_HOST: string;
        DEVICE_AP_PORT: string;
        MMKV_ENCRYPTION_KEY: string;
    }

    export const Config: NativeConfig;
    export default Config;
}