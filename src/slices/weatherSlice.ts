import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getReverseGeocodeApi, getWeatherForecastApi } from '../apis/weatherAPI';
import { WeatherState } from '../types/weather';
import { getCurrentCoordinates, formatReverseGeocodeLabel } from '../utils/location';
import { getWeatherConditionLabel } from '../utils/weatherDisplay';

/**
 * Subset of `WeatherState` that the thunk resolves with.
 * Typed explicitly so the fulfilled reducer can assign without casting.
 */
type WeatherPayload = Pick<
  WeatherState,
  'latitude' | 'longitude' | 'locationLabel' | 'temperature' | 'weatherCode' | 'condition'
>;

const initialState: WeatherState = {
  latitude: null,
  longitude: null,
  locationLabel: 'Loading…',
  temperature: null,
  weatherCode: null,
  condition: '',
  isLoading: false,
  error: null,
};

export const fetchWeatherWithLocation = createAsyncThunk<WeatherPayload, void>(
  'weather/fetchWeatherWithLocation',
  async (): Promise<WeatherPayload> => {
    const { latitude, longitude } = await getCurrentCoordinates();

    const [forecast, geocode] = await Promise.all([
      getWeatherForecastApi(latitude, longitude),
      getReverseGeocodeApi(latitude, longitude).catch(() => ({ results: [] })),
    ]);

    const locationLabel =
      formatReverseGeocodeLabel(geocode.results) ??
      `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;

    const weatherCode = forecast.current.weather_code;

    return {
      latitude,
      longitude,
      locationLabel,
      temperature: forecast.current.temperature_2m,
      weatherCode,
      condition: getWeatherConditionLabel(weatherCode),
    };
  },
);

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchWeatherWithLocation.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWeatherWithLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;
        state.locationLabel = action.payload.locationLabel;
        state.temperature = action.payload.temperature;
        state.weatherCode = action.payload.weatherCode;
        state.condition = action.payload.condition;
      })
      .addCase(fetchWeatherWithLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to load weather';
        state.locationLabel = 'Weather unavailable';
      });
  },
});

export default weatherSlice.reducer;
