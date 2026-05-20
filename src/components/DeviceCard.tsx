import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors } from '../themes/colors';
import { textFont } from '../utils/textFont';

type DeviceCardProps = {
  name: string;
  location?: string;
  status?: string;
  onPress?: () => void;
};

const DeviceCard: React.FC<DeviceCardProps> = ({
  name,
  location,
  status,
  onPress,
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View>
      <Text style={{ ...textFont.regularM, color: colors.textPrimary }}>
        {name}
      </Text>
      {location ? (
        <Text style={{ ...textFont.regularXS, color: colors.textSecondary }}>
          {location}
        </Text>
      ) : null}
    </View>
    {status ? (
      <View>
        <Text style={{ ...textFont.regularS, color: colors.warning }}>
          {status}
        </Text>
      </View>
    ) : null}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgSecondary,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default DeviceCard;

