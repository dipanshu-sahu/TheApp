export type OpenMeteoCurrent = {
  time: string;
  interval: number;
  temperature_2m: number;
  weather_code: number;
};

export type OpenMeteoForecastResponse = {
  latitude: number;
  longitude: number;
  current: OpenMeteoCurrent;
};

export type OpenMeteoGeocodeResult = {
  name: string;
  admin1?: string;
  country?: string;
};

export type OpenMeteoReverseGeocodeResponse = {
  results?: OpenMeteoGeocodeResult[];
};

export type WeatherState = {
  latitude: number | null;
  longitude: number | null;
  locationLabel: string;
  temperature: number | null;
  weatherCode: number | null;
  condition: string;
  isLoading: boolean;
  error: string | null;
};
