/**
 * Centralized route-name constants for React Navigation. Always
 * navigate via `ROUTES.<NAME>` — never a raw string — per
 * src/navigation/README.md. Covers every screen currently scaffolded
 * under src/screens/, not only the 13 in the initial build spec, so
 * this file doesn't need revisiting when later groups add navigators.
 */
export const ROUTES = {
  // Root navigators
  AUTH_STACK: 'AuthStack',
  MAIN_TABS: 'MainTabNavigator',

  // Auth stack — src/screens/Auth/
  SPLASH: 'Splash',
  LOGIN: 'Login',
  OTP_VERIFICATION: 'OTPVerification',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',

  // Main bottom tab bar
  HOME_TAB: 'HomeTab',
  DELIVERIES_TAB: 'DeliveriesTab',
  PROFILE_TAB: 'ProfileTab',

  // Home — src/screens/Home/
  HOME: 'Home',

  // Order stack — mounted under the Deliveries tab, src/screens/Orders/
  ORDER_LIST: 'OrderList',
  ORDER_DETAIL: 'OrderDetail',
  COMPLETED_ORDER_DETAIL: 'CompletedOrderDetail',
  ORDER_TRACKING: 'OrderTracking',

  // Delivery stack — nested inside the Order stack, src/screens/Delivery/
  ACTIVE_DELIVERY: 'ActiveDelivery',
  DELIVERY_PROOF: 'DeliveryProof',
  CUSTOMER_OTP: 'CustomerOTP',
  DELIVERY_COMPLETE: 'DeliveryComplete',

  // Profile stack — src/screens/Profile/. Also hosts OrderHistory per
  // the nav spec, even though that screen physically lives under
  // Orders/. Notifications is its own bottom tab (see MainTabNavigator),
  // not nested here.
  PROFILE_MAIN: 'ProfileMain',
  EDIT_PROFILE: 'EditProfile',
  SETTINGS: 'Settings',
  ORDER_HISTORY: 'OrderHistory',
  NOTIFICATIONS: 'Notifications',

  // Support — src/screens/Support/
  SUPPORT: 'Support',

  // Payment stack — src/screens/Payments/
  PAYMENT_METHODS: 'PaymentMethods',
  PAYMENT_HISTORY: 'PaymentHistory',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];
