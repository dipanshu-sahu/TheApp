import { IconName } from '../types/icons';

export const getWeatherConditionLabel = (weatherCode: number): string => {
  switch (weatherCode) {
    case 0:
      return 'Clear / Sunny';
    case 1:
      return 'Mainly Clear';
    case 2:
      return 'Partly Cloudy';
    case 3:
      return 'Cloudy';
    case 45:
    case 48:
      return 'Foggy';
    case 51:
    case 53:
    case 55:
      return 'Drizzle';
    case 61:
    case 63:
    case 65:
      return 'Rainy';
    case 71:
    case 73:
    case 75:
      return 'Snowing';
    default:
      if (weatherCode >= 95) {
        return 'Thunderstorm';
      }
      return 'Partly Cloudy';
  }
};

export const getWeatherIconName = (
  weatherCode: number,
  isNight = false,
): IconName => {
  switch (weatherCode) {
    case 0:
    case 1:
      return isNight ? 'moon' : 'sun';
    case 2:
      return 'partly-cloudy';
    case 3:
      return 'cloud';
    case 45:
    case 48:
      return 'cloud-fog';
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
      return 'cloud-rain';
    case 71:
    case 73:
    case 75:
      return 'cloud-snow';
    default:
      if (weatherCode >= 95) {
        return 'cloud-lightning';
      }
      return 'partly-cloudy';
  }
};

export const formatTemperature = (celsius: number): string =>
  `${Math.round(celsius)}°`;
