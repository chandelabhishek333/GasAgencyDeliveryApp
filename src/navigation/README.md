# src/navigation/ — Navigation Layer

Built on **React Navigation v6**. Defines all routes, stacks, and tab bars.

---

## Structure

```
navigation/
├── RootNavigator.tsx       # Top-level navigator (Auth vs App)
├── stacks/
│   ├── AuthStack.tsx       # Login → Register → OTP → ForgotPassword
│   ├── OrderStack.tsx      # OrderList → OrderDetail → ActiveDelivery → DeliveryProof → CustomerOTP → Complete
│   ├── ProfileStack.tsx    # ProfileMain → EditProfile → Settings
│   └── PaymentStack.tsx    # PaymentMethods → PaymentHistory
└── tabs/
    └── MainTabNavigator.tsx  # Bottom tab bar (Home, Orders, Delivery, Profile)
```

---

## Route Names

All route name strings are defined as constants in `src/constants/routes.ts`  
to avoid typo bugs and enable easy refactoring.

```ts
// Example usage
navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: '123' });
```

---

## Deep Linking

Deep link configuration is handled inside `RootNavigator.tsx`.  
See `docs/guides/deployment/` for URL scheme configuration on iOS and Android.
