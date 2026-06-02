import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../Icon';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';

const WeatherWidget: React.FC = () => (
  <View style={styles.wrapper}>
    <Icon
      name="weather-card-bg"
      width="100%"
      height="100%"
      style={StyleSheet.absoluteFill}
      preserveAspectRatio="none"
    />
    <View style={styles.content}>
      <View style={styles.left}>
        <View style={styles.locationRow}>
          <Icon name="location-pin" width={14} height={14} />
          <Text style={styles.location}>Noida, UP</Text>
        </View>
        <Text style={styles.temperature}>32°</Text>
        <Text style={styles.condition}>Partly Cloudy</Text>
      </View>
      <Icon name="partly-cloudy" width={72} height={72} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
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
