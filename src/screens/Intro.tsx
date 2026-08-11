import React, { useRef, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Screen from '../components/ui/Screen';
import AppText from '../components/ui/AppText';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';
import Icon from '../components/Icon';
import { IconName } from '../types/icons';
import { colors } from '../themes/colors';
import { spacing } from '../themes/spacing';
import { radii } from '../themes/radii';
import { shadows } from '../themes/shadows';

type Slide = {
  key: string;
  title: string;
  description: string;
  icon: IconName;
  gradient: [string, string];
  accents: { icon: IconName; tint: string }[];
};

const SLIDES: Slide[] = [
  {
    key: 'control',
    title: 'Control Your Entire Home',
    description: 'Manage every smart device from one beautiful app — lights, climate and security, right in your pocket.',
    icon: 'home',
    gradient: [colors.gradPrimaryStart, colors.gradPrimaryEnd],
    accents: [
      { icon: 'bulb', tint: colors.cta },
      { icon: 'thermostat', tint: colors.primary },
      { icon: 'camera', tint: colors.gradPrimaryEnd },
    ],
  },
  {
    key: 'automate',
    title: 'Automate Every Routine',
    description: 'Build scenes that run themselves. Wake up, leave home or wind down with a single, effortless tap.',
    icon: 'zap',
    gradient: [colors.gradAmberStart, colors.gradAmberEnd],
    accents: [
      { icon: 'clock', tint: colors.cta },
      { icon: 'sunrise', tint: colors.warning },
      { icon: 'moon', tint: colors.primary },
    ],
  },
  {
    key: 'secure',
    title: 'Secure & Always Connected',
    description: 'Stay in control from anywhere with real-time status, instant alerts and rock-solid encryption.',
    icon: 'shield',
    gradient: [colors.gradSuccessStart, colors.gradSuccessEnd],
    accents: [
      { icon: 'wifi', tint: colors.secondary },
      { icon: 'bell', tint: colors.cta },
      { icon: 'power-button', tint: colors.primary },
    ],
  },
];

const SlidePreview: React.FC<{ slide: Slide }> = ({ slide }) => {
  const gradId = `introHero-${slide.key}`;
  return (
    <View style={styles.previewWrap}>
      <GlassCard variant="soft" radius={radii.xxl} style={styles.previewCard}>
        <View style={[styles.heroTile, shadows.glow]}>
          <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
            <Defs>
              <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={slide.gradient[0]} />
                <Stop offset="1" stopColor={slide.gradient[1]} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" rx={radii.xl} fill={`url(#${gradId})`} />
          </Svg>
          <Icon name={slide.icon} width={56} height={56} color={colors.white} strokeWidth={1.6} />
        </View>

        <View style={styles.accentRow}>
          {slide.accents.map((accent, i) => (
            <View key={i} style={styles.accentTile}>
              <Icon name={accent.icon} width={22} height={22} color={accent.tint} />
            </View>
          ))}
        </View>
      </GlassCard>
    </View>
  );
};

const Dot: React.FC<{ index: number; scrollX: SharedValue<number>; width: number }> = ({
  index,
  scrollX,
  width,
}) => {
  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * width, index * width, (index + 1) * width];
    const dotWidth = interpolate(scrollX.value, input, [8, 24, 8], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, input, [0.35, 1, 0.35], Extrapolation.CLAMP);
    return { width: dotWidth, opacity };
  });
  return <Animated.View style={[styles.dot, style]} />;
};

const Intro: React.FC = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [index, setIndex] = useState(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const handleMomentumEnd = (e: { nativeEvent: { contentOffset: { x: number } } }) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const isLast = index === SLIDES.length - 1;

  const handlePrimary = () => {
    if (isLast) {
      navigation.navigate('Login' as never);
    } else {
      const next = index + 1;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setIndex(next);
    }
  };

  return (
    <Screen edges={['top', 'bottom']} padded={false} ambientTint={SLIDES[index].gradient[1]}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumEnd}
        style={styles.scroll}
      >
        {SLIDES.map(slide => (
          <View key={slide.key} style={[styles.slide, { width }]}>
            <SlidePreview slide={slide} />
            <View style={styles.copy}>
              <AppText variant="display" align="center" style={styles.title}>
                {slide.title}
              </AppText>
              <AppText variant="bodyLg" color={colors.textSecondary} align="center" style={styles.description}>
                {slide.description}
              </AppText>
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Dot key={i} index={i} scrollX={scrollX} width={width} />
          ))}
        </View>
        <Button
          title={isLast ? 'Get Started' : 'Continue'}
          rightIcon="arrow-next"
          size="lg"
          onPress={handlePrimary}
        />
        {!isLast ? (
          <Button
            title="Skip to Sign In"
            variant="ghost"
            size="md"
            fullWidth={false}
            onPress={() => navigation.navigate('Login' as never)}
            style={styles.skip}
          />
        ) : null}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  previewWrap: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  previewCard: {
    width: '86%',
    aspectRatio: 0.92,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  heroTile: {
    flex: 1,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  accentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  accentTile: {
    flex: 1,
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    paddingHorizontal: spacing.sm,
  },
  title: {
    marginBottom: spacing.sm,
  },
  description: {
    paddingHorizontal: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  skip: {
    alignSelf: 'center',
    marginTop: spacing.xs,
  },
});

export default Intro;
