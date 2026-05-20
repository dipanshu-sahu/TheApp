import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../slices/userSlice';
import deviceReducer from '../slices/deviceSlice';

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    devices: deviceReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
