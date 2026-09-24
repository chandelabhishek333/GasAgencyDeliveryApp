# src/store/ — Redux State Management

Uses **Redux Toolkit** for state management with one slice per domain.

---

## Structure

```
store/
├── index.ts              # Store configuration & root reducer
├── slices/               # One slice per feature domain
│   ├── authSlice.ts
│   ├── ordersSlice.ts
│   ├── deliverySlice.ts
│   ├── userSlice.ts
│   └── notificationsSlice.ts
├── selectors/            # Memoized selectors (reselect)
│   ├── authSelectors.ts
│   ├── ordersSelectors.ts
│   └── deliverySelectors.ts
└── middleware/           # Custom Redux middleware
    └── loggerMiddleware.ts
```

---

## Slice Convention

Each slice exports:
- `actions` — action creators
- `reducer` — the reducer function
- Named async thunks for API-triggered state changes

---

## Rules

- ❌ Never put API response raw data into the store without normalizing it first.
- ✅ Use `createAsyncThunk` for any async operation.
- ✅ Keep selectors in `selectors/` — never compute derived state inside components.
