import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

import Icon from '../Icon';
import AppText from '../ui/AppText';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { shadows } from '../../themes/shadows';
import { RootState } from '../../store/store';
import { formatTemperature, getWeatherIconName } from '../../utils/weatherDisplay';

const isNightNow = () => {
  const h = new Date().getHours();
  return h < 6 || h >= 19;
};

const WeatherWidget: React.FC = () => {
  const { locationLabel, temperature, weatherCode, condition, isLoading, error } = useSelector(
    (state: RootState) => state.weather,
  );

  const night = isNightNow();
  const weatherIcon = weatherCode !== null ? getWeatherIconName(weatherCode, night) : 'partly-cloudy';
  const temperatureLabel = temperature !== null ? formatTemperature(temperature) : '--°';
  const conditionLabel = condition || (isLoading ? 'Loading…' : '—');

  return (
    <View style={[styles.wrapper, shadows.md]}>
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id="weatherGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={night ? '#25324A' : colors.primaryDeep} />
            <Stop offset="1" stopColor={night ? '#161E29' : '#2B3E5C'} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" rx={radii.xl} fill="url(#weatherGrad)" />
      </Svg>

      <View style={styles.content}>
        <View style={styles.left}>
          <View style={styles.locationRow}>
            <Icon name="location-pin" width={14} height={14} color={colors.textSecondary} />
            <AppText variant="caption" color={colors.textSecondary} numberOfLines={1} style={styles.location}>
              {locationLabel}
            </AppText>
          </View>

          {isLoading ? (
            <ActivityIndicator color={colors.white} style={styles.loader} />
          ) : (
            <>
              <AppText variant="displayXl">{temperatureLabel}</AppText>
              <AppText variant="bodyLg" color={colors.textSecondary} numberOfLines={1}>
                {error ? 'Weather unavailable' : conditionLabel}
              </AppText>
            </>
          )}
        </View>

        {!isLoading ? (
          <View style={styles.iconWrap}>
            <Icon name={weatherIcon} width={64} height={64} color={colors.white} strokeWidth={1.6} />
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 152,
    borderRadius: radii.xl,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  left: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginBottom: spacing.xs,
  },
  location: {
    flex: 1,
  },
  loader: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  iconWrap: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WeatherWidget;
