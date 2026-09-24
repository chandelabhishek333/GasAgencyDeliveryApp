import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { ordersReducer } from './slices/ordersSlice';
import { deliveryReducer } from './slices/deliverySlice';
import { userReducer } from './slices/userSlice';
import { notificationsReducer } from './slices/notificationsSlice';
import { loggerMiddleware } from './middleware/loggerMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    delivery: deliveryReducer,
    user: userReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
