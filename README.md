# 🚚 DeliveryApp — React Native

> A professional, scalable React Native delivery application powered by external REST/GraphQL API endpoints.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Running the App](#running-the-app)
- [API Integration](#api-integration)
- [Documentation](#documentation)
- [Contributing](#contributing)

---

## Overview

DeliveryApp is a cross-platform mobile application built with React Native. It connects to external API endpoints for all data management (orders, users, drivers, deliveries, payments).

---

## Tech Stack

| Layer             | Technology                        |
|-------------------|-----------------------------------|
| Framework         | React Native (CLI)                |
| Language          | TypeScript                        |
| State Management  | Redux Toolkit + RTK Query         |
| Navigation        | React Navigation v6               |
| API Client        | Axios                             |
| Maps              | React Native Maps                 |
| Push Notifications| Firebase Cloud Messaging          |
| Testing           | Jest + React Native Testing Lib   |
| Linting           | ESLint + Prettier                 |

---

## Project Structure

```
DeliveryApp/
├── src/                   # All application source code
│   ├── api/               # API client, services & endpoint definitions
│   ├── assets/            # Static assets (fonts, images, icons, animations)
│   ├── components/        # Reusable UI components
│   ├── config/            # App-level configuration (env, constants)
│   ├── constants/         # App-wide constant values
│   ├── contexts/          # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── navigation/        # Navigation stacks and tab definitions
│   ├── screens/           # Screen-level components (one folder per screen)
│   ├── store/             # Redux store, slices, middleware, selectors
│   ├── theme/             # Colors, typography, spacing, global styles
│   ├── types/             # Global TypeScript types and interfaces
│   └── utils/             # Pure utility / helper functions
├── docs/                  # Project documentation
├── __tests__/             # Unit, integration and E2E tests
├── scripts/               # Build & deployment automation scripts
├── env/                   # Environment variable files (.env.*)
└── .github/               # GitHub Actions CI/CD workflows
```

---

## Getting Started

See [`docs/guides/setup/`](./docs/guides/setup/) for the full step-by-step guide.

```bash
# 1. Install dependencies
npm install   # or: yarn install

# 2. iOS (macOS only)
cd ios && pod install && cd ..

# 3. Copy environment file
cp env/.env.example env/.env.development
```

---

## Environment Setup

All environment variables live in the `env/` folder. Never commit real secrets.

| File                  | Purpose                    |
|-----------------------|----------------------------|
| `.env.development`    | Local development values   |
| `.env.staging`        | Staging server values      |
| `.env.production`     | Production server values   |
| `.env.example`        | Template — safe to commit  |

---

## Running the App

```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios

# Start Metro bundler only
npx react-native start
```

---

## API Integration

All API calls go through `src/api/`. See [`docs/api/`](./docs/api/) for endpoint contracts.

- **Base URL** is read from `env/.env.*` via `src/config/apiConfig.ts`
- **Auth headers** are injected automatically by `src/api/interceptors/`
- **Each feature domain** has its own service file in `src/api/services/`

---

## Documentation

| Doc                                      | Description                      |
|------------------------------------------|----------------------------------|
| [`docs/api/`](./docs/api/)               | Endpoint reference & contracts   |
| [`docs/architecture/`](./docs/architecture/) | Architecture decisions (ADRs) |
| [`docs/guides/setup/`](./docs/guides/setup/)         | Environment setup      |
| [`docs/guides/contributing/`](./docs/guides/contributing/) | Contribution guide |
| [`docs/guides/deployment/`](./docs/guides/deployment/)     | Release & deployment   |
| [`docs/design/`](./docs/design/)         | Screen & component designs       |
| [`docs/changelog/`](./docs/changelog/)   | Version history                  |

---

## Contributing

Please read [`docs/guides/contributing/CONTRIBUTING.md`](./docs/guides/contributing/CONTRIBUTING.md) before submitting a PR.
