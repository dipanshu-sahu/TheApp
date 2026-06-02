import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';
import BootSplash from 'react-native-bootsplash';
import AppNavigator from './navigation';
import store, { RootState, AppDispatch } from './store/store';
import { restoreSession } from './slices/userSlice';
import { colors } from './themes/colors';

const AppRoot = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isRestoringSession, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  );

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  if (isRestoringSession) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return <AppNavigator isAuthenticated={isAuthenticated} />;
};

export default () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer
          onReady={() => {
            BootSplash.hide({ fade: true });
          }}
        >
          <AppRoot />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
