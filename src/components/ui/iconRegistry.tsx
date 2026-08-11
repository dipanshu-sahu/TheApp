import React from 'react';
import {
  Circle,
  Line,
  Path,
  Polyline,
  Rect,
} from 'react-native-svg';
import { IconName } from '../../types/icons';

/**
 * Unified premium outline icon kit.
 *
 * Every glyph is drawn on a 24x24 canvas with a single consistent stroke
 * weight, round line caps and joins, and no fill (except intentional dots).
 * This guarantees identical visual weight and aesthetic language across the
 * entire app (design-system requirement #12).
 *
 * Each renderer receives the resolved `color` and `strokeWidth` so callers can
 * tint a glyph without it losing its outline character.
 */
export type IconRenderer = (color: string, sw: number) => React.ReactNode;

const dot = (cx: number, cy: number, r: number, color: string) => (
  <Circle cx={cx} cy={cy} r={r} fill={color} stroke="none" />
);

export const iconRegistry: Partial<Record<IconName, IconRenderer>> = {
  // ---------------- Navigation / chrome ----------------
  search: (c, sw) => (
    <>
      <Circle cx={11} cy={11} r={7} stroke={c} strokeWidth={sw} />
      <Line x1={20.5} y1={20.5} x2={16.5} y2={16.5} stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  more: c => (
    <>
      {dot(5, 12, 1.6, c)}
      {dot(12, 12, 1.6, c)}
      {dot(19, 12, 1.6, c)}
    </>
  ),
  close: (c, sw) => (
    <>
      <Line x1={6} y1={6} x2={18} y2={18} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={18} y1={6} x2={6} y2={18} stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  'arrow-back': (c, sw) => (
    <>
      <Line x1={19} y1={12} x2={5} y2={12} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Polyline points="12,19 5,12 12,5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'arrow-right': (c, sw) => (
    <>
      <Line x1={5} y1={12} x2={19} y2={12} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Polyline points="12,5 19,12 12,19" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'arrow-next': (c, sw) => (
    <Polyline points="9,5 16,12 9,19" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  ),
  'chevron-right': (c, sw) => (
    <Polyline points="9,5 16,12 9,19" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  ),
  'arrow-down': (c, sw) => (
    <Polyline points="5,9 12,16 19,9" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  ),
  'chevron-down': (c, sw) => (
    <Polyline points="5,9 12,16 19,9" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  ),
  'add-circle': (c, sw) => (
    <>
      <Circle cx={12} cy={12} r={9} stroke={c} strokeWidth={sw} />
      <Line x1={12} y1={8} x2={12} y2={16} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={8} y1={12} x2={16} y2={12} stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  plus: (c, sw) => (
    <>
      <Line x1={12} y1={5} x2={12} y2={19} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={5} y1={12} x2={19} y2={12} stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  filter: (c, sw) => (
    <Path d="M4 5h16l-6 7v5l-4 2v-9L4 5Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" />
  ),
  sliders: (c, sw) => (
    <>
      <Line x1={4} y1={8} x2={20} y2={8} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={4} y1={16} x2={20} y2={16} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Circle cx={9} cy={8} r={2.4} stroke={c} strokeWidth={sw} fill="#0B1017" />
      <Circle cx={15} cy={16} r={2.4} stroke={c} strokeWidth={sw} fill="#0B1017" />
    </>
  ),
  list: (c, sw) => (
    <>
      <Line x1={8} y1={7} x2={20} y2={7} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={8} y1={12} x2={20} y2={12} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={8} y1={17} x2={20} y2={17} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      {dot(4, 7, 1.2, c)}
      {dot(4, 12, 1.2, c)}
      {dot(4, 17, 1.2, c)}
    </>
  ),
  grid: (c, sw) => (
    <>
      <Rect x={4} y={4} width={7} height={7} rx={2} stroke={c} strokeWidth={sw} />
      <Rect x={13} y={4} width={7} height={7} rx={2} stroke={c} strokeWidth={sw} />
      <Rect x={4} y={13} width={7} height={7} rx={2} stroke={c} strokeWidth={sw} />
      <Rect x={13} y={13} width={7} height={7} rx={2} stroke={c} strokeWidth={sw} />
    </>
  ),
  trash: (c, sw) => (
    <>
      <Line x1={4} y1={6.5} x2={20} y2={6.5} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M6.5 6.5 7.5 20h9l1-13.5" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M9.5 6.5V4.5h5v2" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Line x1={10} y1={10} x2={10} y2={16.5} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={14} y1={10} x2={14} y2={16.5} stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  edit: (c, sw) => (
    <>
      <Path d="M4 20h4L18.5 9.5a2 2 0 0 0-2.8-2.8L5 17.2 4 20Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Line x1={14.5} y1={7.5} x2={17.5} y2={10.5} stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  refresh: (c, sw) => (
    <>
      <Path d="M20 12a8 8 0 1 1-2.3-5.6" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Polyline points="20,4 20,8 16,8" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  // ---------------- Auth / security ----------------
  mail: (c, sw) => (
    <>
      <Rect x={3} y={5.5} width={18} height={13} rx={3} stroke={c} strokeWidth={sw} />
      <Path d="M4 7.5 12 13l8-5.5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'mail-otp': (c, sw) => (
    <>
      <Rect x={3} y={6} width={14} height={11} rx={3} stroke={c} strokeWidth={sw} />
      <Path d="M4 8 10 12l6-4" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={18.5} cy={6.5} r={3} fill={c} stroke="none" />
    </>
  ),
  'eye-open': (c, sw) => (
    <>
      <Path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Circle cx={12} cy={12} r={3} stroke={c} strokeWidth={sw} />
    </>
  ),
  'eye-close': (c, sw) => (
    <>
      <Path d="M4 6c2.4 3 5 4.5 8 4.5S17.6 9 20 6" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={5} y1={11} x2={3.5} y2={13.5} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={19} y1={11} x2={20.5} y2={13.5} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={12} y1={12} x2={12} y2={15} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={8.5} y1={11.5} x2={7.5} y2={14.5} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={15.5} y1={11.5} x2={16.5} y2={14.5} stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  'password-lock': (c, sw) => (
    <>
      <Rect x={5} y={10.5} width={14} height={9.5} rx={2.5} stroke={c} strokeWidth={sw} />
      <Path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      {dot(12, 15, 1.4, c)}
    </>
  ),
  'lock-key': (c, sw) => (
    <>
      <Rect x={5} y={10.5} width={14} height={9.5} rx={2.5} stroke={c} strokeWidth={sw} />
      <Path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Circle cx={12} cy={14.5} r={1.6} stroke={c} strokeWidth={sw} />
      <Line x1={12} y1={16} x2={12} y2={17.5} stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  key: (c, sw) => (
    <>
      <Circle cx={8} cy={8} r={4} stroke={c} strokeWidth={sw} />
      <Line x1={11} y1={11} x2={20} y2={20} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={17} y1={17} x2={19} y2={15} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={14.5} y1={14.5} x2={16.5} y2={12.5} stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  shield: (c, sw) => (
    <>
      <Path d="M12 3 19 6v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Polyline points="9,12 11,14 15,10" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  // ---------------- Identity / status ----------------
  home: (c, sw) => (
    <>
      <Path d="M4 11 12 4l8 7" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 10v9h12v-9" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M10 19v-5h4v5" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
    </>
  ),
  profile: (c, sw) => (
    <>
      <Circle cx={12} cy={8.5} r={3.5} stroke={c} strokeWidth={sw} />
      <Path d="M5 19.5a7 7 0 0 1 14 0" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  'power-button': (c, sw) => (
    <>
      <Path d="M8 6.5a7 7 0 1 0 8 0" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={12} y1={4} x2={12} y2={11} stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  check: (c, sw) => (
    <Polyline points="5,12.5 10,17.5 19,7" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  ),
  'check-circle': (c, sw) => (
    <>
      <Circle cx={12} cy={12} r={9} stroke={c} strokeWidth={sw} />
      <Polyline points="8,12.5 11,15.5 16,9" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  heart: (c, sw) => (
    <Path d="M12 20S3.5 14.5 3.5 8.8A4.3 4.3 0 0 1 12 6.5 4.3 4.3 0 0 1 20.5 8.8C20.5 14.5 12 20 12 20Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
  ),
  favourite: (c, sw) => (
    <Path d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 9.7l5.4-.8L12 4Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
  ),
  map: (c, sw) => (
    <>
      <Path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Line x1={9} y1={4} x2={9} y2={18} stroke={c} strokeWidth={sw} />
      <Line x1={15} y1={6} x2={15} y2={20} stroke={c} strokeWidth={sw} />
    </>
  ),
  'location-pin': (c, sw) => (
    <>
      <Path d="M12 21c4-4.5 6-7.6 6-10.4A6 6 0 0 0 6 10.6C6 13.4 8 16.5 12 21Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Circle cx={12} cy={10.2} r={2.2} stroke={c} strokeWidth={sw} />
    </>
  ),
  phone: (c, sw) => (
    <>
      <Rect x={7} y={3} width={10} height={18} rx={3} stroke={c} strokeWidth={sw} />
      {dot(12, 17.5, 1.1, c)}
    </>
  ),
  settings: (c, sw) => (
    <>
      <Circle cx={12} cy={12} r={3.2} stroke={c} strokeWidth={sw} />
      <Path d="M12 3.5v2.2M12 18.3v2.2M4.7 7.5l1.9 1.1M17.4 15.4l1.9 1.1M4.7 16.5l1.9-1.1M17.4 8.6l1.9-1.1" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  devices: (c, sw) => (
    <>
      <Rect x={3} y={5} width={12} height={9} rx={2} stroke={c} strokeWidth={sw} />
      <Line x1={7} y1={17.5} x2={11} y2={17.5} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={9} y1={14} x2={9} y2={17.5} stroke={c} strokeWidth={sw} />
      <Rect x={16} y={9} width={5} height={11} rx={1.6} stroke={c} strokeWidth={sw} />
    </>
  ),
  wifi: (c, sw) => (
    <>
      <Path d="M4 9c4.5-3.8 11.5-3.8 16 0" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M7 12.5c3-2.6 7-2.6 10 0" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M9.5 15.8c1.6-1.4 3.4-1.4 5 0" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      {dot(12, 18.6, 1.2, c)}
    </>
  ),
  zap: (c, sw) => (
    <Path d="M13 3 5 13h6l-1 8 8-11h-6l1-7Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
  ),
  bell: (c, sw) => (
    <>
      <Path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2H4.5L6 17Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M10 19.5a2 2 0 0 0 4 0" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  clock: (c, sw) => (
    <>
      <Circle cx={12} cy={12} r={8.5} stroke={c} strokeWidth={sw} />
      <Polyline points="12,7 12,12 15.5,14" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  calendar: (c, sw) => (
    <>
      <Rect x={4} y={5.5} width={16} height={15} rx={3} stroke={c} strokeWidth={sw} />
      <Line x1={4} y1={9.5} x2={20} y2={9.5} stroke={c} strokeWidth={sw} />
      <Line x1={8} y1={3.5} x2={8} y2={7} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={16} y1={3.5} x2={16} y2={7} stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  sunrise: (c, sw) => (
    <>
      <Path d="M8 15a4 4 0 0 1 8 0" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={3} y1={18.5} x2={21} y2={18.5} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M12 4.5v3M12 4.5 9.8 6.7M12 4.5l2.2 2.2" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  // ---------------- Weather ----------------
  sun: (c, sw) => (
    <>
      <Circle cx={12} cy={12} r={4.2} stroke={c} strokeWidth={sw} />
      <Path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  moon: (c, sw) => (
    <Path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
  ),
  cloud: (c, sw) => (
    <Path d="M7 18h9.5a3.5 3.5 0 0 0 .3-7 5 5 0 0 0-9.6-1.2A3.9 3.9 0 0 0 7 18Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
  ),
  'partly-cloudy': (c, sw) => (
    <>
      <Circle cx={8.5} cy={8} r={3} stroke={c} strokeWidth={sw} />
      <Path d="M6.5 4.6 5.6 3.7M11.4 4.6l.9-.9M4.5 8H3.2M13.8 8h-1.3" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M9 19h8a3.2 3.2 0 0 0 .2-6.4 4.5 4.5 0 0 0-8.7-1A3.5 3.5 0 0 0 9 19Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
    </>
  ),
  'cloud-rain': (c, sw) => (
    <>
      <Path d="M7 15h9.3a3.4 3.4 0 0 0 .3-6.8 4.8 4.8 0 0 0-9.3-1.1A3.8 3.8 0 0 0 7 15Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Line x1={9} y1={17.5} x2={8} y2={20} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={13} y1={17.5} x2={12} y2={20} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={16.5} y1={17.5} x2={15.5} y2={20} stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  'cloud-snow': (c, sw) => (
    <>
      <Path d="M7 15h9.3a3.4 3.4 0 0 0 .3-6.8 4.8 4.8 0 0 0-9.3-1.1A3.8 3.8 0 0 0 7 15Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      {dot(9, 18.5, 1.1, c)}
      {dot(13, 18.5, 1.1, c)}
      {dot(16, 18.5, 1.1, c)}
    </>
  ),
  'cloud-fog': (c, sw) => (
    <>
      <Path d="M7 13.5h9.3a3.4 3.4 0 0 0 .3-6.8 4.8 4.8 0 0 0-9.3-1.1A3.8 3.8 0 0 0 7 13.5Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Line x1={6} y1={17} x2={18} y2={17} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={8} y1={20} x2={16} y2={20} stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  'cloud-lightning': (c, sw) => (
    <>
      <Path d="M7 14h9.3a3.4 3.4 0 0 0 .3-6.8 4.8 4.8 0 0 0-9.3-1.1A3.8 3.8 0 0 0 7 14Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M12.5 15 10 19h2.2l-.7 3 3-4.2h-2.2l0.2-2.8Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
    </>
  ),

  // ---------------- Device types ----------------
  bulb: (c, sw) => (
    <>
      <Path d="M8.5 14.5a5 5 0 1 1 7 0c-.8.8-1.2 1.5-1.3 2.5h-4.4c-.1-1-.5-1.7-1.3-2.5Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Line x1={9.8} y1={20} x2={14.2} y2={20} stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={10.5} y1={17} x2={13.5} y2={17} stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  fan: (c, sw) => (
    <>
      <Circle cx={12} cy={12} r={1.8} stroke={c} strokeWidth={sw} />
      <Path d="M12 10.2C12 6 13.5 4 16 4c2 0 2.6 3-4 6.2Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M13.8 12C18 12 20 13.5 20 16c0 2-3 2.6-6.2-4Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M12 13.8C12 18 10.5 20 8 20c-2 0-2.6-3 4-6.2Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M10.2 12C6 12 4 10.5 4 8c0-2 3-2.6 6.2 4Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
    </>
  ),
  thermostat: (c, sw) => (
    <>
      <Path d="M10 13.5V6a2 2 0 0 1 4 0v7.5a4 4 0 1 1-4 0Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Circle cx={12} cy={16.5} r={1.6} fill={c} stroke="none" />
    </>
  ),
  camera: (c, sw) => (
    <>
      <Rect x={3} y={7} width={13} height={10} rx={2.5} stroke={c} strokeWidth={sw} />
      <Path d="M16 10.5 21 8v8l-5-2.5" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Circle cx={8} cy={12} r={2.2} stroke={c} strokeWidth={sw} />
    </>
  ),
  plug: (c, sw) => (
    <>
      <Path d="M8 11V5.5M16 11V5.5" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M6 11h12v1.5a6 6 0 0 1-4.5 5.8V22h-3v-3.7A6 6 0 0 1 6 12.5V11Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
    </>
  ),
  socket: (c, sw) => (
    <>
      <Rect x={4} y={4} width={16} height={16} rx={5} stroke={c} strokeWidth={sw} />
      {dot(9.5, 11, 1.4, c)}
      {dot(14.5, 11, 1.4, c)}
      <Line x1={10} y1={15} x2={14} y2={15} stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  switch: (c, sw) => (
    <>
      <Rect x={4} y={8} width={16} height={8} rx={4} stroke={c} strokeWidth={sw} />
      <Circle cx={15.5} cy={12} r={2.5} fill={c} stroke="none" />
    </>
  ),
  mesh: (c, sw) => (
    <>
      <Circle cx={12} cy={5} r={2} stroke={c} strokeWidth={sw} />
      <Circle cx={5} cy={17} r={2} stroke={c} strokeWidth={sw} />
      <Circle cx={19} cy={17} r={2} stroke={c} strokeWidth={sw} />
      <Line x1={11} y1={6.7} x2={6} y2={15.3} stroke={c} strokeWidth={sw} />
      <Line x1={13} y1={6.7} x2={18} y2={15.3} stroke={c} strokeWidth={sw} />
      <Line x1={7} y1={17} x2={17} y2={17} stroke={c} strokeWidth={sw} />
    </>
  ),

  // ---------------- Misc / storefront ----------------
  store: (c, sw) => (
    <>
      <Path d="M4 9 5 5h14l1 4a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-4 0Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M5 11v9h14v-9" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
    </>
  ),
  land: (c, sw) => (
    <>
      <Path d="M12 4 3 8l9 4 9-4-9-4Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <Path d="M3 13l9 4 9-4" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
    </>
  ),
};

// Illustration aliases mapped to clean vectors already defined above.
iconRegistry['intro-house'] = iconRegistry.home;
iconRegistry['intro-lightbulb'] = iconRegistry.bulb;
iconRegistry['intro-ac'] = iconRegistry.thermostat;
iconRegistry['intro-camera'] = iconRegistry.camera;
iconRegistry['intro-rings'] = (c, sw) => (
  <>
    <Circle cx={12} cy={12} r={9} stroke={c} strokeWidth={sw} opacity={0.35} />
    <Circle cx={12} cy={12} r={6} stroke={c} strokeWidth={sw} opacity={0.6} />
    <Circle cx={12} cy={12} r={3} stroke={c} strokeWidth={sw} />
  </>
);
iconRegistry['weather-card-bg'] = iconRegistry.cloud;
iconRegistry['partly-cloudy-bg'] = iconRegistry['partly-cloudy'];
iconRegistry['button-gradient'] = iconRegistry.zap;
iconRegistry['button-gradient-green'] = iconRegistry.check;
