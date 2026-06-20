import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

import Icon from '../Icon';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';
import { RootState } from '../../store/store';
import {
  formatTemperature,
  getWeatherIconName,
} from '../../utils/weatherDisplay';

const WeatherWidget: React.FC = () => {
  const {
    locationLabel,
    temperature,
    weatherCode,
    condition,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.weather);

  const weatherIcon =
    weatherCode !== null ? getWeatherIconName(weatherCode) : 'partly-cloudy';
  const temperatureLabel =
    temperature !== null ? formatTemperature(temperature) : '--°';
  const conditionLabel = condition || (isLoading ? 'Loading…' : '—');

  return (
    <View style={styles.wrapper}>
      <Icon
        name="weather-card-bg"
        style={styles.background}
        preserveAspectRatio="none"
      />
      <View style={styles.content}>
        <View style={styles.left}>
          <View style={styles.locationRow}>
            <Icon name="location-pin" width={14} height={14} />
            <Text style={styles.location} numberOfLines={1}>
              {locationLabel}
            </Text>
          </View>

          {isLoading ? (
            <ActivityIndicator
              color={colors.accent}
              style={styles.loader}
            />
          ) : (
            <>
              <Text style={styles.temperature}>{temperatureLabel}</Text>
              <Text style={styles.condition} numberOfLines={1}>
                {error ? 'Weather unavailable' : conditionLabel}
              </Text>
            </>
          )}
        </View>

        {!isLoading ? (
          <Icon name={weatherIcon} width={72} height={72} />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
  },
  background: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  location: {
    ...textFont.regularS,
    color: colors.textSecondary,
    flex: 1,
  },
  loader: {
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  temperature: {
    ...textFont.boldXXXL,
    color: colors.textPrimary,
    fontSize: 48,
    lineHeight: 52,
  },
  condition: {
    ...textFont.regularM,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default WeatherWidget;
