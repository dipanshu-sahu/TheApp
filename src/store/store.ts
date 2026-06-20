import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from '../slices/deviceSlice';
import weatherReducer from '../slices/weatherSlice';
import userReducer from '../slices/userSlice';
import siteReducer from '../slices/siteSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    devices: deviceReducer,
    weather: weatherReducer,
    site: siteReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
