import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { iconNames, IconName } from '../types/icons';

export { iconNames, IconName };

import SearchIcon from '../../assets/icons/search.svg';
import LandIcon from '../../assets/icons/land.svg';
import MoreIcon from '../../assets/icons/more.svg';
import FavouriteIcon from '../../assets/icons/favourite.svg';
import StoreIcon from '../../assets/icons/store.svg';
import ArrowRightIcon from '../../assets/icons/arrow-right.svg';
import ArrowNextIcon from '../../assets/icons/arrow-next.svg';
import ArrowBackIcon from '../../assets/icons/arrow-back.svg';
import CloseIcon from '../../assets/icons/close.svg';
import PasswordLockIcon from '../../assets/icons/password-lock.svg';
import HeartIcon from '../../assets/icons/heart.svg';
import MapIcon from '../../assets/icons/map.svg';
import ListIcon from '../../assets/icons/list.svg';
import FilterIcon from '../../assets/icons/filter.svg';
import AddCircleIcon from '../../assets/icons/add-circle.svg';
import MailIcon from '../../assets/icons/mail.svg';
import EyeCloseIcon from '../../assets/icons/eye-close.svg';
import EyeOpenIcon from '../../assets/icons/eye-open.svg';
import HomeIcon from '../../assets/icons/home.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import PowerButtonIcon from '../../assets/icons/power-button.svg';
import ArrowDownIcon from '../../assets/icons/arrow-down.svg';
import IntroRingsIcon from '../../assets/icons/intro-rings.svg';
import IntroHouseIcon from '../../assets/icons/intro-house.svg';
import IntroLightbulbIcon from '../../assets/icons/intro-lightbulb.svg';
import IntroAcIcon from '../../assets/icons/intro-ac.svg';
import IntroCameraIcon from '../../assets/icons/intro-camera.svg';
import ButtonGradientIcon from '../../assets/icons/button-gradient.svg';
import PhoneIcon from '../../assets/icons/phone.svg';
import CheckCircleIcon from '../../assets/icons/check-circle.svg';
import ButtonGradientGreenIcon from '../../assets/icons/button-gradient-green.svg';
import KeyIcon from '../../assets/icons/key.svg';
import MailOtpIcon from '../../assets/icons/mail-otp.svg';
import LockKeyIcon from '../../assets/icons/lock-key.svg';
import CheckIcon from '../../assets/icons/check.svg';
import LocationPinIcon from '../../assets/icons/location-pin.svg';
import PartlyCloudyIcon from '../../assets/icons/partly-cloudy.svg';
import PlugIcon from '../../assets/icons/plug.svg';
import SettingsIcon from '../../assets/icons/settings.svg';
import DevicesIcon from '../../assets/icons/devices.svg';
import WeatherCardBgIcon from '../../assets/icons/weather-card-bg.svg';


const iconMap: Record<IconName, React.FC<SvgProps>> = {
  search: SearchIcon,
  land: LandIcon,
  more: MoreIcon,
  favourite: FavouriteIcon,
  store: StoreIcon,
  'arrow-right': ArrowRightIcon,
  'arrow-next': ArrowNextIcon,
  'arrow-back': ArrowBackIcon,
  close: CloseIcon,
  'password-lock': PasswordLockIcon,
  heart: HeartIcon,
  map: MapIcon,
  list: ListIcon,
  filter: FilterIcon,
  'add-circle': AddCircleIcon,
  mail: MailIcon,
  'eye-close': EyeCloseIcon,
  'eye-open': EyeOpenIcon,
  home: HomeIcon,
  profile: ProfileIcon,
  'power-button': PowerButtonIcon,
  'arrow-down': ArrowDownIcon,
  'intro-rings': IntroRingsIcon,
  'intro-house': IntroHouseIcon,
  'intro-lightbulb': IntroLightbulbIcon,
  'intro-ac': IntroAcIcon,
  'intro-camera': IntroCameraIcon,
  'button-gradient': ButtonGradientIcon,
  phone: PhoneIcon,
  'check-circle': CheckCircleIcon,
  'button-gradient-green': ButtonGradientGreenIcon,
  key: KeyIcon,
  'mail-otp': MailOtpIcon,
  'lock-key': LockKeyIcon,
  check: CheckIcon,
  'location-pin': LocationPinIcon,
  'partly-cloudy': PartlyCloudyIcon,
  plug: PlugIcon,
  settings: SettingsIcon,
  devices: DevicesIcon,
  'weather-card-bg': WeatherCardBgIcon,
};

export type IconProps = {
  name: IconName;
  size?: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
} & Omit<SvgProps, 'width' | 'height'>;

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  width,
  height,
  fill,
  stroke,
  color,
  style,
  ...rest
}) => {
  const IconComponent = iconMap[name];
  const iconWidth = width ?? size;
  const iconHeight = height ?? size;

  return (
    <IconComponent
      width={iconWidth}
      height={iconHeight}
      fill={fill ?? color}
      stroke={stroke ?? color}
      style={style}
      {...rest}
    />
  );
};

export default Icon;
