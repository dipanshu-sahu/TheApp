import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Icon, { IconName } from '../Icon';
import AppText from '../ui/AppText';
import AnimatedPressable from '../ui/AnimatedPressable';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing, TOUCH_TARGET } from '../../themes/spacing';
import { shadows } from '../../themes/shadows';
import { springs } from '../../themes/motion';

type TabDef = { route: string; label: string; icon: IconName; stroke: boolean };

const LEFT_TABS: TabDef[] = [
  { route: 'HomeTab', label: 'Home', icon: 'home', stroke: true },
  { route: 'DevicesTab', label: 'Devices', icon: 'devices', stroke: true },
];

const RIGHT_TABS: TabDef[] = [
  { route: 'AutoTab', label: 'Auto', icon: 'settings', stroke: true },
  { route: 'Profile', label: 'Me', icon: 'profile', stroke: false },
];

const ROOT_SCREEN_BY_TAB: Record<string, string> = {
  HomeTab: 'Home',
  DevicesTab: 'Home',
  Profile: 'Profile',
};

const TabItem: React.FC<{
  tab: TabDef;
  isFocused: boolean;
  onPress: () => void;
}> = ({ tab, isFocused, onPress }) => {
  const progress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isFocused ? 1 : 0, springs.gentle);
  }, [isFocused, progress]);

  const iconWrapStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -progress.value * 2 }, { scale: 1 + progress.value * 0.06 }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.5 + progress.value * 0.5 }],
  }));

  const color = isFocused ? colors.primary : colors.textTertiary;

  return (
    <AnimatedPressable
      onPress={onPress}
      pressScale={0.9}
      style={styles.tab}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={tab.label}
    >
      <Animated.View style={iconWrapStyle}>
        <Icon
          name={tab.icon}
          size={22}
          stroke={tab.stroke ? color : undefined}
          fill={tab.stroke ? undefined : color}
          color={color}
        />
      </Animated.View>
      <AppText variant="micro" color={color} style={styles.label}>
        {tab.label}
      </AppText>
      <Animated.View style={[styles.dot, dotStyle]} />
    </AnimatedPressable>
  );
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index];
  const focusedRouteName = getFocusedRouteNameFromRoute(currentRoute);
  const rootScreen = ROOT_SCREEN_BY_TAB[currentRoute.name];
  const hideTabBar =
    rootScreen !== undefined &&
    focusedRouteName !== undefined &&
    focusedRouteName !== rootScreen;

  const fabScale = useSharedValue(1);
  const fabAnimated = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

  if (hideTabBar) {
    return null;
  }

  const handlePress = (routeName: string) => {
    const routeIndex = state.routes.findIndex(r => r.name === routeName);
    const isFocused = state.index === routeIndex;
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes[routeIndex]?.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const renderTab = (tab: TabDef) => {
    const routeIndex = state.routes.findIndex(r => r.name === tab.route);
    return (
      <TabItem
        key={tab.route}
        tab={tab}
        isFocused={state.index === routeIndex}
        onPress={() => handlePress(tab.route)}
      />
    );
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      <View style={styles.bar}>
        <View style={styles.side}>{LEFT_TABS.map(renderTab)}</View>

        <View style={styles.fabSlot}>
          <AnimatedPressable
            onPress={() => navigation.navigate('HomeTab', { screen: 'ScanDevice' })}
            onPressIn={() => {
              fabScale.value = withSpring(0.92, springs.press);
            }}
            onPressOut={() => {
              fabScale.value = withSpring(1, springs.press);
            }}
            pressScale={1}
            style={styles.fabPressable}
            accessibilityRole="button"
            accessibilityLabel="Add device"
          >
            <Animated.View style={[styles.fab, shadows.glow, fabAnimated]}>
              <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
                <Defs>
                  <LinearGradient id="fabGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor={colors.gradPrimaryStart} />
                    <Stop offset="1" stopColor={colors.gradPrimaryEnd} />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" rx={32} fill="url(#fabGrad)" />
              </Svg>
              <Icon name="add-circle" width={28} height={28} stroke={colors.white} />
              <View style={styles.fabDot} />
            </Animated.View>
          </AnimatedPressable>
        </View>

        <View style={styles.side}>{RIGHT_TABS.map(renderTab)}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.md,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    minHeight: 66,
    borderRadius: radii.xxl,
    backgroundColor: colors.glassStrong,
    borderWidth: StyleSheet.hairlineWidth * 1.5,
    borderColor: colors.glassBorderStrong,
    ...shadows.lg,
    overflow: 'visible',
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    minWidth: TOUCH_TARGET,
    minHeight: TOUCH_TARGET,
  },
  label: {
    marginTop: 3,
  },
  dot: {
    marginTop: 3,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  fabSlot: {
    width: 72,
    alignItems: 'center',
  },
  fabPressable: {
    marginTop: -32,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.glassBorderStrong,
  },
  fabDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cta,
    borderWidth: 1.5,
    borderColor: colors.bgSecondary,
  },
});

export default CustomTabBar;
