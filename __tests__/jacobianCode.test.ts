import { decodeJacobianCode, resolveDeviceProfile } from '../src/utils/jacobianCode';

const EXPECTED: ReadonlyArray<[string, string]> = [
  ['eJS12', '12 Switch'],
  ['eJS7F1', '7 Switch + 1 Fan'],
  ['eJS8', '8 Switch'],
  ['eJS6F2', '6 Switch + 2 Fan'],
  ['eJS6P1', '6 Switch + 1 Plug'],
  ['eJS5F1P1', '5 Switch + 1 Fan + 1 Plug'],
  ['eJS5D1P1', '5 Switch + 1 Dimmer + 1 Plug'],
  ['eJS3F1P1', '3 Switch + 1 Fan + 1 Plug'],
  ['eJS4P1', '4 Switch + 1 Plug'],
  ['eJS2P2', '2 Switch + 2 Plug'],
  ['eJS7D1', '7 Switch + 1 Dimmer'],
  ['eJS6D1F1', '6 Switch + 1 Dimmer + 1 Fan'],
  ['eJS6D2', '6 Switch + 2 Dimmer'],
  ['eJS3D1P1', '3 Switch + 1 Dimmer + 1 Plug'],
  ['eJP2', '2 Plug'],
  ['eJS12P2', '12 Switch + 2 Plug'],
  ['eJS6F2P2', '6 Switch + 2 Fan + 2 Plug'],
  ['eJS7F1P2', '7 Switch + 1 Fan + 2 Plug'],
  ['eJS8P2', '8 Switch + 2 Plug'],
  ['eJS4', '4 Switch'],
  ['eJS6', '6 Switch'],
  ['eJS3F1', '3 Switch + 1 Fan'],
  ['eJS3D1', '3 Switch + 1 Dimmer'],
  ['eJS1P1', '1 Switch + 1 Plug'],
  ['eJS3', '3 Switch'],
  ['eJS2P1', '2 Switch + 1 Plug'],
  ['eJS2', '2 Switch'],
  ['eJC2', '1 Curtain'],
  ['eJA16', '1 Switch'],
  ['eJD1', '1 Dimmer'],
  ['eJB1', '1 Doorbell'],
];

test('every catalog code decodes to the published combination', () => {
  EXPECTED.forEach(([code, summary]) => {
    expect(`${code}: ${decodeJacobianCode(code)?.summary}`).toBe(`${code}: ${summary}`);
  });
});

test('high load rating and labels', () => {
  const profile = decodeJacobianCode('eJA16');
  expect(profile?.channels[0].label).toBe('16A Switch');
  expect(decodeJacobianCode('eJS2P2')?.channels.map(c => c.label)).toEqual([
    'Switch 1',
    'Switch 2',
    'Socket 1',
    'Socket 2',
  ]);
});

test('falls back to name and pins', () => {
  expect(resolveDeviceProfile({ id: '1', name: 'Living Room eJS7F1 panel' }).code).toBe('eJS7F1');
  expect(resolveDeviceProfile({ id: '2', name: '4gang wifi-ble switch-cb' }).channels).toHaveLength(4);
  expect(
    resolveDeviceProfile({
      id: '3',
      name: 'Panel',
      digitalPins: [{ pinNumber: 2, state: 0 }, { pinNumber: 3, state: 1 }],
    }).channels,
  ).toHaveLength(2);
  expect(resolveDeviceProfile({ id: '4', name: 'Smart Bulb' }).channels).toHaveLength(0);
});
