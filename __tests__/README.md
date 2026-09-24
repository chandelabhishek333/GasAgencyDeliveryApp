# __tests__/ — Test Suite

All automated tests live here, separated by type.

---

## Structure

```
__tests__/
├── unit/
│   ├── components/      # Component rendering tests
│   ├── hooks/           # Custom hook tests (renderHook)
│   └── utils/           # Pure function tests
├── integration/
│   ├── api/             # API service integration tests (mocked server)
│   └── screens/         # Screen + navigation flow tests
├── e2e/                 # End-to-end tests (Detox)
└── mocks/               # Shared mocks, stubs, fixtures
```

---

## Running Tests

```bash
# All unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E (Detox) — Android
npx detox test --configuration android.emu.release

# E2E (Detox) — iOS
npx detox test --configuration ios.sim.release
```

---

## Coverage Targets

| Layer        | Target  |
|--------------|---------|
| `utils/`     | ≥ 90%   |
| `hooks/`     | ≥ 80%   |
| `api/`       | ≥ 80%   |
| `components/`| ≥ 70%   |
| `screens/`   | ≥ 60%   |

---

## Mocks

Shared mocks (e.g., navigation mock, API response fixtures) live in `__tests__/mocks/`.  
Import them in tests using the `@mocks` path alias.
