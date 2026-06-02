import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';

type HomeHeaderProps = {
  greeting: string;
  homeTitle: string;
  avatarLabel: string;
  onProfilePress?: () => void;
};

const HomeHeader: React.FC<HomeHeaderProps> = ({
  greeting,
  homeTitle,
  avatarLabel,
  onProfilePress,
}) => (
  <View style={styles.wrapper}>
    <View style={styles.textBlock}>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.title}>{homeTitle}</Text>
    </View>
    <TouchableOpacity style={styles.avatar} onPress={onProfilePress}>
      <Text style={styles.avatarText}>{avatarLabel}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  textBlock: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    ...textFont.regularM,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    ...textFont.boldXXL,
    color: colors.textPrimary,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...textFont.boldL,
    color: colors.textPrimary,
  },
});

export default HomeHeader;
