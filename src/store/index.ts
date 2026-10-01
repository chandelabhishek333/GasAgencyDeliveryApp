import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { UnknownAction } from '@reduxjs/toolkit';
import { authReducer, forceLogout, logoutAll, logoutUser } from './slices/authSlice';
import { ordersReducer } from './slices/ordersSlice';
import { deliveryReducer } from './slices/deliverySlice';
import { userReducer } from './slices/userSlice';
import { notificationsReducer } from './slices/notificationsSlice';
import { loggerMiddleware } from './middleware/loggerMiddleware';

const appReducer = combineReducers({
  auth: authReducer,
  orders: ordersReducer,
  delivery: deliveryReducer,
  user: userReducer,
  notifications: notificationsReducer,
});

// Any sign-out wipes every slice, not just auth — so the next driver to
// log in on this device never sees the previous one's orders/profile/etc.
const isSignOut = (action: UnknownAction): boolean =>
  logoutUser.fulfilled.match(action) ||
  logoutUser.rejected.match(action) ||
  logoutAll.fulfilled.match(action) ||
  forceLogout.match(action);

const rootReducer: typeof appReducer = (state, action) =>
  appReducer(isSignOut(action) ? undefined : state, action);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
