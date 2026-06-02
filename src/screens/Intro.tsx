import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../themes/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { textFont } from '../utils/textFont';
import { useNavigation } from '@react-navigation/native';
import IntroIllustration from '../components/IntroIllustration';
import GradientButton from '../components/GradientButton';

const Intro: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustrationSection}>
          <IntroIllustration />
        </View>

        <View style={styles.dots}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <Text style={styles.title}>Control Your Entire Home</Text>
        <Text style={styles.description}>
          Manage all smart devices from one beautiful app. Lights, AC, security
          — all in your pocket.
        </Text>
      </View>

      <View style={styles.footer}>
        <GradientButton
          title="Next →"
          onPress={() => navigation.navigate('Login' as never)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationSection: {
    marginBottom: 32,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 28,
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.dotActive,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.dotInactive,
  },
  title: {
    ...textFont.boldXL,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    ...textFont.regularM,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  footer: {
    paddingBottom: 24,
  },
});

export default Intro;
