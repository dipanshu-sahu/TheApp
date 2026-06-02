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
  ForgotPasswordOtp,
  ForgotPasswordReset,
  SignUp,
  Device,
  ResetPassword,
  ChangePassword,
  ProfileUpdate,
  AddDevice,
  ScanDevice,
  Devices,
} from '../screens';
import CustomTabBar from '../components/home/CustomTabBar';

type HomeStackParamList = {
  Intro: undefined;
  Login: undefined;
  App: undefined;
  ForgotPassword: undefined;
  ForgotPasswordOtp: { email: string };
  ForgotPasswordReset: { email: string; otp: string };
  SignUp: undefined;
};

export type MyHomeStackParamList = {
  Home: undefined;
  Device: { deviceId: string };
  ScanDevice: { retryMessage?: string } | undefined;
  AddDevice: {
    deviceSSID: string;
    deviceBSSID: string;
  };
};

type ProfileStackParamList = {
  Profile: undefined;
  ResetPassword: undefined;
  ChangePassword: undefined;
  ProfileUpdate: undefined;
};

const AppStack = createNativeStackNavigator<HomeStackParamList>();
const MyHomeStack = createNativeStackNavigator<MyHomeStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const Tab = createBottomTabNavigator();

const HomeStackNavigator = () => {
  return (
    <MyHomeStack.Navigator screenOptions={{ headerShown: false }}>
      <MyHomeStack.Screen name="Home" component={Home} />
      <MyHomeStack.Screen name="Device" component={Device} />
      <MyHomeStack.Screen name="ScanDevice" component={ScanDevice} />
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

const DevicesStackNavigator = () => (
  <MyHomeStack.Navigator screenOptions={{ headerShown: false }}>
    <MyHomeStack.Screen name="Home" component={Devices} />
    <MyHomeStack.Screen name="Device" component={Device} />
  </MyHomeStack.Navigator>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
      <Tab.Screen name="DevicesTab" component={DevicesStackNavigator} />
      <Tab.Screen name="AutoTab" component={More} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

const AppNavigator = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <AppStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isAuthenticated ? 'App' : 'Intro'}
    >
      <AppStack.Screen name="Intro" component={Intro} />
      <AppStack.Screen name="Login" component={Login} />
      <AppStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <AppStack.Screen name="ForgotPasswordOtp" component={ForgotPasswordOtp} />
      <AppStack.Screen
        name="ForgotPasswordReset"
        component={ForgotPasswordReset}
      />
      <AppStack.Screen name="SignUp" component={SignUp} />
      <AppStack.Screen name="App" component={TabNavigator} />
    </AppStack.Navigator>
  );
};

export default AppNavigator;
