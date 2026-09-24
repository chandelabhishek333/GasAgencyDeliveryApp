# src/screens/ — Screen Components

Each screen maps to **one route** in the navigation stack.  
Screens are the **only place** where hooks, store state, and navigation props are wired together.

---

## Structure

```
screens/
├── Auth/
│   ├── Login/
│   ├── Register/
│   ├── ForgotPassword/
│   └── OTPVerification/
├── Home/
├── Orders/
│   ├── OrderList/
│   ├── OrderDetail/
│   ├── OrderTracking/
│   └── OrderHistory/
├── Delivery/
│   ├── ActiveDelivery/
│   ├── DeliveryProof/
│   └── DeliveryComplete/
├── Profile/
│   ├── ProfileMain/
│   ├── EditProfile/
│   └── Settings/
├── Notifications/
├── Support/
└── Payments/
    ├── PaymentMethods/
    └── PaymentHistory/
```

---

## Each Screen Folder Contains

| File              | Purpose                                         |
|-------------------|-------------------------------------------------|
| `index.tsx`       | Screen component (layout + hook wiring)         |
| `styles.ts`       | StyleSheet scoped to this screen                |
| `useScreenName.ts`| Local hook (data fetching, local state, etc.)   |
| `types.ts`        | Navigation param types for this screen          |

---

## Rules

- ❌ No raw API calls — use hooks from `src/hooks/`.
- ❌ No shared business logic — put it in `src/utils/` or `src/hooks/`.
- ✅ Keep screen files focused: compose components, wire hooks, handle navigation.
