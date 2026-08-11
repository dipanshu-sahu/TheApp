import TcpSocket from 'react-native-tcp-socket';
import { DEVICE_AP_HOST, DEVICE_AP_PORT, MQTT_BROKER_URL } from '../constants/appConfig';

enum ProvisioningStep {
  eResponse_D2A_Provision      = 300,
  eResponse_D2C_Provision      = 400,
  eUserDetails_A2D_Provision   = 201,
  eMeshDetails_A2D_Provision,
  eMqttDetails_A2D_Provision,
  eDeviceDetails_A2D_Provision,
  eDataExchangeDone_A2D_Provision,
  eInvalid_Provision,
}

export type ProvisioningMeta = {
  readonly siteId: string;
  readonly meshId: string;
  readonly gatewayMac: string;
  readonly subGatewayMac: string;
  readonly deviceRole: number;
  readonly srcMac: string;
  readonly dstMac: string;
  readonly boardType: number;
  readonly deviceType: number;
  readonly userId: string;
  readonly deviceName: string;
  readonly roomHint: string;
};

export type ProvisioningInput = {
  readonly userId: string;
  readonly deviceId: string;
  readonly wifiSsid: string;
  readonly wifiPassword: string;
  readonly meshId: string;
  readonly gatewayMac: string;
  readonly subGatewayMac: string;
  readonly deviceRole: number;
  readonly siteId: string;
  readonly siteLocation: string;
};

export type ProvisioningResult = ProvisioningMeta;

/**
 * Typed shape of JSON messages the device sends back over TCP.
 * Fields are optional since different steps include different fields.
 */
type DeviceMessage = {
  readonly payloadType?: number;
  readonly status?: number;
  readonly boardType?: number;
  readonly deviceType?: number;
  readonly deviceMac?: string;
};

/**
 * Runs the full TCP provisioning protocol against the device AP.
 *
 * Connects to `DEVICE_AP_HOST:DEVICE_AP_PORT`, exchanges JSON messages
 * across 5 steps, and resolves with the metadata needed to register the
 * device on the backend. Rejects on any protocol or network error.
 */
export const runProvisioningProtocol = (
  input: ProvisioningInput,
): Promise<ProvisioningResult> =>
  new Promise((resolve, reject) => {
    const {
      userId,
      deviceId,
      wifiSsid,
      wifiPassword,
      meshId,
      gatewayMac,
      subGatewayMac,
      deviceRole,
      siteId,
      siteLocation,
    } = input;

    let stopped = false;
    let step = 1;
    let capturedDeviceMac = '';
    let capturedBoardType = 0;
    let capturedDeviceType = 0;

    const fail = (reason: string): void => {
      if (!stopped) {
        stopped = true;
        reject(new Error(reason));
      }
    };

    const client = TcpSocket.createConnection(
      { port: DEVICE_AP_PORT, host: DEVICE_AP_HOST },
      () => {
        const send = (obj: Record<string, unknown>): void => {
          client.write(JSON.stringify(obj));
        };

        send({
          payloadType: ProvisioningStep.eUserDetails_A2D_Provision,
          usrId: userId,
        });

        client.on('data', (data: Buffer | string) => {
          if (stopped) {
            return;
          }
          try {
            // The TCP data event delivers a Buffer or string; parse into the
            // known message shape. Remaining unknown fields are safely ignored.
            const response = JSON.parse(data.toString()) as DeviceMessage;

            if (response.status === -1) {
              stopped = true;
              client.destroy();
              fail('Device rejected provisioning (status -1).');
              return;
            }

            if (response.payloadType === 501) {
              capturedBoardType  = response.boardType  ?? 0;
              capturedDeviceType = response.deviceType ?? 0;
              capturedDeviceMac  = response.deviceMac  ?? '';
            }

            switch (step) {
              case 1:
                send({
                  payloadType: ProvisioningStep.eMeshDetails_A2D_Provision,
                  usrId: userId,
                  deviceId,
                  Wifissid: wifiSsid,
                  Wifipswd: wifiPassword,
                });
                step++;
                break;

              case 2:
                send({
                  payloadType: ProvisioningStep.eMqttDetails_A2D_Provision,
                  usrId: userId,
                  deviceId,
                  meshId,
                  gatewayMac,
                  subGatewayMac,
                  deviceRole,
                });
                step++;
                break;

              case 3:
                send({
                  payloadType: ProvisioningStep.eDeviceDetails_A2D_Provision,
                  usrId: userId,
                  deviceId,
                  brokerUrl: MQTT_BROKER_URL,
                  mqttUsrName: capturedDeviceMac,
                  // Combine first 3 chars of deviceId + first 3 chars of MAC for the MQTT password
                  mqttUsrPswd: capturedDeviceMac
                    ? `${deviceId.slice(0, 3)}${capturedDeviceMac.slice(0, 3)}`
                    : '',
                  lwtTopic:      `${siteId}/lwt`,
                  mqttPubTopic:  `${siteId}/pub`,
                  mqttSubTopic:  `${siteId}/sub`,
                });
                step++;
                break;

              case 4:
                send({
                  payloadType: ProvisioningStep.eDataExchangeDone_A2D_Provision,
                  usrId: userId,
                  deviceId,
                });
                step++;
                break;

              case 5:
                stopped = true;
                client.destroy();
                resolve({
                  siteId,
                  meshId,
                  gatewayMac,
                  subGatewayMac,
                  deviceRole,
                  srcMac:     deviceId,
                  dstMac:     gatewayMac,
                  boardType:  capturedBoardType,
                  deviceType: capturedDeviceType,
                  userId,
                  deviceName: `${siteLocation} device`,
                  roomHint:   siteLocation,
                });
                break;

              default:
                break;
            }
          } catch {
            stopped = true;
            client.destroy();
            fail('Failed to parse device response.');
          }
        });

        client.on('error', () => {
          stopped = true;
          client.destroy();
          fail('TCP connection error during provisioning.');
        });

        client.on('close', () => {
          if (!stopped) {
            fail('TCP connection closed unexpectedly.');
          }
        });
      },
    );
  });
