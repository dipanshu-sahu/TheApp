import axios from 'axios';
import {
  OpenMeteoForecastResponse,
  OpenMeteoReverseGeocodeResponse,
} from '../types/weather';

const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/reverse';

export const getWeatherForecastApi = async (
  latitude: number,
  longitude: number,
): Promise<OpenMeteoForecastResponse> => {
  const response = await axios.get<OpenMeteoForecastResponse>(
    OPEN_METEO_FORECAST_URL,
    {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,weather_code',
      },
    },
  );
  return response.data;
};

export const getReverseGeocodeApi = async (
  latitude: number,
  longitude: number,
): Promise<OpenMeteoReverseGeocodeResponse> => {
  const response = await axios.get<OpenMeteoReverseGeocodeResponse>(
    OPEN_METEO_GEOCODE_URL,
    {
      params: {
        latitude,
        longitude,
        language: 'en',
        count: 1,
      },
    },
  );
  return response.data;
};
