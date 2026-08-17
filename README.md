# ANC Unity

Native ANC member application built with Expo and React Native.

## Run on a device

1. Install [Expo Go](https://expo.dev/go) on an Android or iOS device.
2. Install dependencies with `npm install`.
3. Start the development server with `npm start -- --clear`.
4. Scan the QR code from Expo Go.

## Native commands

- `npm run android` — open on a connected Android device/emulator.
- `npm run ios` — open on an iOS simulator (requires Xcode).

Expo Go must support Expo SDK 57. Update Expo Go in the App Store or Play Store,
restart Metro, and scan the newly generated QR code. The application is configured
for Android and iOS only; web is intentionally unsupported.

The app includes sign-in, member dashboard, money transfer, services payments,
donations, membership contributions, profile, branch, and updates flows. Money
and payment screens are static UI demonstrations only; they do not perform real
transactions.
