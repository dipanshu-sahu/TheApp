import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../Icon';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';

type TabIconName = 'home' | 'devices' | 'settings' | 'profile';

const LEFT_TABS = [
  { route: 'HomeTab', label: 'Home', icon: 'home' as TabIconName },
  { route: 'DevicesTab', label: 'Devices', icon: 'devices' as TabIconName },
];

const RIGHT_TABS = [
  { route: 'AutoTab', label: 'Auto', icon: 'settings' as TabIconName },
  { route: 'Profile', label: 'Me', icon: 'profile' as TabIconName },
];

const ROOT_SCREEN_BY_TAB: Record<string, string> = {
  HomeTab: 'Home',
  DevicesTab: 'Home',
  Profile: 'Profile',
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

  if (hideTabBar) {
    return null;
  }

  const renderTab = (
    routeName: string,
    label: string,
    icon: TabIconName,
    useStroke?: boolean,
  ) => {
    const routeIndex = state.routes.findIndex(r => r.name === routeName);
    const isFocused = state.index === routeIndex;
    const color = isFocused ? colors.accent : colors.greyLight;

    return (
      <TouchableOpacity
        key={routeName}
        style={styles.tab}
        onPress={() => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[routeIndex]?.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(routeName);
          }
        }}
        activeOpacity={0.8}
      >
        <Icon
          name={icon}
          size={22}
          stroke={useStroke ? color : undefined}
          fill={useStroke ? undefined : color}
          color={color}
        />
        <Text style={[styles.label, isFocused && styles.labelFocused]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.bar}>
        <View style={styles.side}>
          {LEFT_TABS.map(tab => renderTab(tab.route, tab.label, tab.icon, true))}
        </View>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('HomeTab', { screen: 'ScanDevice' })}
          activeOpacity={0.9}
        >
          <View style={styles.fabDot} />
          <Icon name="add-circle" width={28} height={28} stroke={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.side}>
          {RIGHT_TABS.map(tab =>
            renderTab(tab.route, tab.label, tab.icon, tab.icon === 'settings'),
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.homeBg,
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 12,
    minHeight: 60,
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 56,
  },
  label: {
    ...textFont.regularXS,
    color: colors.greyLight,
    marginTop: 4,
  },
  labelFocused: {
    color: colors.accent,
    ...textFont.boldXS,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -28,
    marginHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },
  fabDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.badgeNew,
    borderWidth: 1.5,
    borderColor: colors.homeBg,
  },
});

export default CustomTabBar;
