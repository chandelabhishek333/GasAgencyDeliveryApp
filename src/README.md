# src/ — Application Source Code

This is the **root of all application logic**. Every subdirectory has a single, well-defined responsibility.

---

## Directory Map

| Folder         | Responsibility                                                              |
|----------------|-----------------------------------------------------------------------------|
| `api/`         | Axios client instance, request/response interceptors, API service classes  |
| `assets/`      | Static files: fonts, images, icons, Lottie animations                      |
| `components/`  | Reusable, presentational UI components grouped by domain                   |
| `config/`      | Runtime configuration (API base URL, feature flags, third-party keys)      |
| `constants/`   | Immutable string/number constants shared across the app                    |
| `contexts/`    | React Context providers (Auth, Theme, Location, etc.)                      |
| `hooks/`       | Custom React hooks (data fetching, form handling, permissions, etc.)       |
| `navigation/`  | React Navigation stack and tab definitions                                 |
| `screens/`     | Screen-level components; one folder per screen                             |
| `store/`       | Redux Toolkit store, slices, selectors, middleware                         |
| `theme/`       | Design tokens: colors, typography, spacing, shadow, border-radius          |
| `types/`       | Shared TypeScript interfaces, types, and enums                             |
| `utils/`       | Pure, stateless utility/helper functions                                   |

---

## Developer Rules

1. **No business logic in screens.** Screens only compose components and call hooks.
2. **No direct `fetch` calls.** All API calls go through `api/services/`.
3. **No inline styles.** Use `theme/` tokens or StyleSheet objects.
4. **Typed always.** Every file must be `.ts` or `.tsx`. No `any` unless unavoidable.
