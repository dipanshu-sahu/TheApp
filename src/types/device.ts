export type DeviceInfo = {
  id: string;
  name: string;
  location?: string;
  status?: string;
};

export type AddDeviceRequest = {
  siteId: string;
  meshId: string;
  srcMac: string;
  dstMac: string;
  gatewayMac: string;
  subGatewayMac: string;
  boardType: number;
  deviceType: number;
  deviceRole: number;
  userId: string;
};

