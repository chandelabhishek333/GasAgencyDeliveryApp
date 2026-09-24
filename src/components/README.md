# src/components/ — Reusable UI Components

All components here are **purely presentational** (no direct API calls, no Redux dispatch).  
They receive data via props and emit events via callbacks.

---

## Structure

```
components/
├── common/          # Generic, domain-agnostic UI building blocks
│   ├── Button/
│   ├── Input/
│   ├── Modal/
│   ├── Card/
│   ├── Loader/
│   ├── Toast/
│   ├── Avatar/
│   └── Badge/
├── layout/          # Structural / navigation shell components
│   ├── Header/
│   ├── Footer/
│   ├── BottomTabBar/
│   └── Drawer/
└── delivery/        # Delivery-domain-specific components
    ├── OrderCard/
    ├── TrackingMap/
    ├── DeliveryStatus/
    └── DriverCard/
```

---

## Each Component Folder Contains

| File               | Purpose                                      |
|--------------------|----------------------------------------------|
| `index.tsx`        | Component implementation                     |
| `styles.ts`        | StyleSheet for the component                 |
| `types.ts`         | Props interface / TypeScript types           |
| `README.md`        | Usage examples and prop documentation        |

---

## Rules

- ❌ No `useSelector`, `useDispatch`, or API calls inside components.
- ✅ Accept all data as props.
- ✅ Name the main export to match the folder name exactly.
- ✅ Export from an `index.tsx` so imports stay clean:  
  `import { Button } from '@components/common/Button'`
