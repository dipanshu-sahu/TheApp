import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  More,
  Home,
  Profile,
  Login,
  Intro,
  ForgotPassword,
  SignUp,
  Device,
  ResetPassword,
  ChangePassword,
  ProfileUpdate,
  AddDevice,
} from '../screens';
import { colors } from '../themes/colors';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Text } from 'react-native';
import { textFont } from '../utils/textFont';
import { HomeIcon, MoreIcon, ProfileIcon } from '../assets/icons';

type HomeStackParamList = {
  Intro: undefined;
  Login: undefined;
  App: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
};

type MyHomeStackParamList = {
  Home: undefined;
  Device: { deviceId: string };
  AddDevice: undefined;
};

type ProfileStackParamList = {
  Profile: undefined;
  ResetPassword: undefined;
  ChangePassword: undefined;
  ProfileUpdate: undefined;
};

const TabText = ({ name, focused }: { name: string; focused: boolean }) => (
  <Text
    style={{
      ...textFont.boldXS,
      marginTop: 3,
      color: focused ? colors.secondary : colors.greyLight,
    }}
  >
    {name}
  </Text>
);

const AppStack = createNativeStackNavigator<HomeStackParamList>();
const MyHomeStack = createNativeStackNavigator<MyHomeStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const Tab = createBottomTabNavigator();

const HomeStackNavigator = () => {
  return (
    <MyHomeStack.Navigator screenOptions={{ headerShown: false }}>
      <MyHomeStack.Screen name="Home" component={Home} />
      <MyHomeStack.Screen name="Device" component={Device} />
      <MyHomeStack.Screen name="AddDevice" component={AddDevice} />
    </MyHomeStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen name="ResetPassword" component={ResetPassword} />
      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePassword}
      />
      <ProfileStack.Screen
        name="ProfileUpdate"
        component={ProfileUpdate}
      />
    </ProfileStack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgSecondary,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={({ route }) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          const getTabBarStyle = () => {
            if (focusedRouteName !== 'Home' && !!focusedRouteName) {
              return { tabBarStyle: { display: 'none' } };
            }
            return {};
          };
          return {
            tabBarIcon: ({ focused }) => (
              <HomeIcon
                height={24}
                width={24}
                stroke={focused ? colors.secondary : colors.greyLight}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <TabText name="Home" focused={focused} />
            ),
            ...getTabBarStyle(),
          };
        }}
      />
      <Tab.Screen
        name="More"
        component={More}
        options={({ route }) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          const getTabBarStyle = () => {
            if (focusedRouteName === 'Home') {
              return { tabBarStyle: { display: 'none' } };
            }
            return {};
          };
          return {
            tabBarIcon: ({ focused }) => (
              <MoreIcon
                height={24}
                width={24}
                fill={focused ? colors.secondary : colors.greyLight}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <TabText name="More" focused={focused} />
            ),
            ...getTabBarStyle(),
          };
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={({ route }) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          const getTabBarStyle = () => {
            if (focusedRouteName !== 'Profile' && !!focusedRouteName) {
              return { tabBarStyle: { display: 'none' } };
            }
            return {};
          };
          return {
            tabBarIcon: ({ focused }) => (
              <ProfileIcon
                height={24}
                width={24}
                fill={focused ? colors.secondary : colors.greyLight}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <TabText name="Profile" focused={focused} />
            ),
            ...getTabBarStyle(),
          };
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="Intro" component={Intro} />
      <AppStack.Screen name="Login" component={Login} />
      <AppStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <AppStack.Screen name="SignUp" component={SignUp} />
      <AppStack.Screen name="App" component={TabNavigator} />
    </AppStack.Navigator>
  );
};

export default AppNavigator;
