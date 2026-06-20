import axios from 'axios';
import { Alert } from 'react-native';
import { signOut } from '../utils/authSession';
import { resetToLogin } from '../utils/NavigationService';

const instance = axios.create({
  baseURL: 'http://64.227.160.209:9090',
});

instance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await signOut();

      // Lazy import to avoid circular dependency (store → userSlice → userAPI → axios)
      const { default: store } = await import('../store/store');
      store.dispatch({ type: 'user/forceLogout' });

      Alert.alert(
        'Session Expired',
        'Your session has expired. Please log in again.',
        [{ text: 'OK' }],
      );

      resetToLogin();
    }
    return Promise.reject(error);
  },
);

export default instance;
