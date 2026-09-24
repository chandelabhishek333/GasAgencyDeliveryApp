# Architecture Overview

## System Design

DeliveryApp follows a **layered, unidirectional data flow** architecture.

```
┌─────────────────────────────────────────────────────────┐
│                        SCREENS                          │
│          (Compose components, wire hooks & nav)         │
└──────────────────────────┬──────────────────────────────┘
                           │ uses
┌──────────────────────────▼──────────────────────────────┐
│                     CUSTOM HOOKS                        │
│       (Business logic, local state, API triggers)       │
└───────────────┬──────────────────────┬──────────────────┘
                │ reads/writes         │ calls
┌───────────────▼──────────┐  ┌───────▼──────────────────┐
│       REDUX STORE        │  │       API SERVICES        │
│  (Global persisted state)│  │  (Axios + interceptors)   │
└──────────────────────────┘  └───────────────────────────┘
                                         │ HTTP
                               ┌─────────▼─────────────┐
                               │  EXTERNAL API SERVER   │
                               └───────────────────────┘
```

## Key Principles

| Principle              | Implementation                                          |
|------------------------|---------------------------------------------------------|
| **Single source of truth** | Redux store is the only global state             |
| **Separation of concerns** | API / Store / UI in distinct layers               |
| **No prop drilling**   | Context or Redux for deeply nested state                |
| **Type safety**        | TypeScript strict mode everywhere                       |
| **Testability**        | Pure functions in `utils/`, isolated services in `api/` |

## Data Flow Example — Placing an Order

```
User taps "Place Order" button
        ↓
Screen calls `usePlaceOrder()` hook
        ↓
Hook dispatches `placeOrderThunk(payload)`
        ↓
Thunk calls `orderService.createOrder(payload)`
        ↓
Axios POST /orders  →  External API
        ↓
Response normalised → stored in ordersSlice
        ↓
Selector updates → Screen re-renders with new state
```

## State Persistence

Sensitive tokens (access/refresh) are stored in **Keychain (iOS) / Keystore (Android)** via `react-native-keychain`, NOT in Redux or AsyncStorage.

## Offline Strategy

Pending orders/actions are queued in `AsyncStorage` and replayed on reconnect using a custom middleware in `src/store/middleware/`.
