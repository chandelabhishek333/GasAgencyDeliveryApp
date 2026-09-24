# env/ — Environment Variables

This folder holds all `.env.*` files for different build environments.

> ⚠️ **NEVER commit real API keys, tokens, or secrets to version control.**  
> Only `.env.example` should be committed. All other files are gitignored.

---

## Files

| File                | Committed? | Purpose                              |
|---------------------|------------|--------------------------------------|
| `.env.example`      | ✅ Yes      | Template showing all required keys   |
| `.env.development`  | ❌ No       | Local development values             |
| `.env.staging`      | ❌ No       | Staging server values                |
| `.env.production`   | ❌ No       | Production server values             |

---

## Required Variables

```env
# API Configuration
API_BASE_URL=https://api.yourbackend.com/v1
API_TIMEOUT=10000

# Maps
GOOGLE_MAPS_API_KEY=

# Firebase / Push Notifications
FCM_SENDER_ID=
FIREBASE_PROJECT_ID=

# App
APP_ENV=development         # development | staging | production
DEBUG_MODE=true
```

---

## Usage in Code

Variables are accessed via `src/config/apiConfig.ts`:

```ts
import Config from 'react-native-config';

export const API_BASE_URL = Config.API_BASE_URL;
export const API_TIMEOUT = Number(Config.API_TIMEOUT ?? 10000);
```
