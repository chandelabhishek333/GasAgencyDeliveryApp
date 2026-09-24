# Deployment Guide

## Versioning

We follow **Semantic Versioning** (`MAJOR.MINOR.PATCH`).  
Update version in:
- `package.json` → `version`
- `android/app/build.gradle` → `versionName` and `versionCode`
- `ios/DeliveryApp/Info.plist` → `CFBundleShortVersionString` and `CFBundleVersion`

---

## Android — Google Play Store

### 1. Generate a Signed Release APK / AAB

```bash
cd android
./gradlew bundleRelease   # AAB (recommended for Play Store)
# or
./gradlew assembleRelease # APK
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### 2. Sign the Bundle

Store your keystore at a **safe location outside the repo**.  
Configure `android/app/build.gradle`:

```groovy
signingConfigs {
  release {
    storeFile file(MYAPP_UPLOAD_STORE_FILE)
    storePassword MYAPP_UPLOAD_STORE_PASSWORD
    keyAlias MYAPP_UPLOAD_KEY_ALIAS
    keyPassword MYAPP_UPLOAD_KEY_PASSWORD
  }
}
```

Use `android/gradle.properties` (gitignored) for the secrets.

### 3. Upload to Play Console

Upload the `.aab` file to **Google Play Console → Production → Create new release**.

---

## iOS — Apple App Store

### 1. Set Bundle ID & Signing

In Xcode → Signing & Capabilities:
- Team: Your Apple Developer Team
- Bundle Identifier: `com.yourcompany.deliveryapp`
- Provisioning Profile: Distribution

### 2. Archive

```bash
npx react-native run-ios --configuration Release
```

Or use Xcode: **Product → Archive**.

### 3. Upload to App Store Connect

From the Xcode Organizer, click **Distribute App → App Store Connect → Upload**.

---

## CI/CD

GitHub Actions workflows are located in `.github/workflows/`:

| Workflow                  | Trigger               | Description                    |
|---------------------------|-----------------------|--------------------------------|
| `ci.yml`                  | Push to any branch    | Lint + Unit tests              |
| `build-android.yml`       | Push to `dev`         | Build Android AAB              |
| `build-ios.yml`           | Push to `dev`         | Build iOS IPA                  |
| `deploy-production.yml`   | Push to `main`        | Full release pipeline          |

---

## Environment Files per Build

| Build Type  | `.env` File Used        |
|-------------|-------------------------|
| Development | `env/.env.development`  |
| Staging     | `env/.env.staging`      |
| Production  | `env/.env.production`   |
