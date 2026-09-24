# Environment & Project Setup

## Prerequisites

| Tool             | Version     | Install Link                            |
|------------------|-------------|-----------------------------------------|
| Node.js          | >= 18.x     | https://nodejs.org                      |
| npm / yarn       | npm >= 9.x  | Bundled with Node                       |
| React Native CLI | Latest      | `npm install -g react-native-cli`       |
| Android Studio   | Hedgehog+   | https://developer.android.com/studio    |
| Xcode (macOS)    | >= 15.x     | Mac App Store                           |
| CocoaPods        | >= 1.13     | `sudo gem install cocoapods`            |
| JDK              | 17          | https://adoptium.net                    |

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-org/DeliveryApp.git
cd DeliveryApp
```

---

## 2. Install Node Dependencies

```bash
npm install
# or
yarn install
```

---

## 3. Configure Environment Variables

```bash
# Copy the example file
cp env/.env.example env/.env.development

# Open and fill in your values
nano env/.env.development
```

Required variables:

```env
API_BASE_URL=https://api.yourbackend.com/v1
API_TIMEOUT=10000
GOOGLE_MAPS_API_KEY=your_google_maps_key
FCM_SENDER_ID=your_firebase_sender_id
```

---

## 4. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

Add your `GOOGLE_MAPS_API_KEY` to `ios/DeliveryApp/AppDelegate.mm`:

```objc
[GMSServices provideAPIKey:@"YOUR_GOOGLE_MAPS_API_KEY"];
```

---

## 5. Android Setup

Add your `GOOGLE_MAPS_API_KEY` to `android/app/src/main/AndroidManifest.xml`:

```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="YOUR_GOOGLE_MAPS_API_KEY" />
```

---

## 6. Run the App

```bash
# Start Metro bundler
npx react-native start

# Run on Android (new terminal)
npx react-native run-android

# Run on iOS (new terminal, macOS only)
npx react-native run-ios
```

---

## Common Issues

| Problem                           | Fix                                              |
|-----------------------------------|--------------------------------------------------|
| Metro bundler port conflict       | `npx react-native start --port 8082`             |
| Gradle build failure              | `cd android && ./gradlew clean`                  |
| Pod install fails                 | `cd ios && pod deintegrate && pod install`       |
| `JAVA_HOME` not set               | Add `export JAVA_HOME=$(/usr/libexec/java_home)` to `.zshrc` |
