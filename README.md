# ANC Unity Member App

A modern, comprehensive digital platform built for members of the African National Congress (ANC). This application serves as a central hub for members to access their digital membership cards, engage with their local branches, pay subscriptions, and purchase everyday services (airtime, data, electricity) directly from their digital wallets.

## 🚀 Live Demo

**Production URL:** [https://anc-unity.vercel.app](https://anc-unity.vercel.app)

### 🔐 Demo Login Credentials
The application is currently configured to boot directly into a demonstration login screen. Use the following credentials to explore the app:

| Login Method | Identifier | Password |
| :--- | :--- | :--- |
| **Membership Number** | `ANC-1234567` | `123456` |
| **Phone Number** | `0821234567` | `123456` |

*Note: Tapping the green "Locked Credentials" hint chip on the login screen will automatically fill these details.*

## ✨ Key Features

- **Digital Membership Card:** Instant access to your verified ANC membership card with a scannable QR code and active status indicator.
- **My Branch Hub:** Connect with your local branch. RSVP for upcoming Branch General Meetings (BGMs), view announcements, contact Branch Executive Committee (BEC) members, and report local ward service delivery issues.
- **Digital Wallet (MzansiPay Integration):** Deposit funds via Mastercard and manage your app balance securely.
- **Everyday Services:** Purchase Airtime, Data, and Prepaid Electricity (STS 20-digit tokens) seamlessly using your wallet balance.
- **Subscription Management:** Easily pay your annual ANC membership subscription fees.

## 🛠️ Technology Stack

- **Framework:** [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/)
- **Routing/Navigation:** React Navigation (Custom state-based routing for web compatibility)
- **Styling:** Custom CSS/StyleSheet (Responsive design for mobile and web)
- **Icons:** Expo Vector Icons (MaterialIcons)
- **Web Deployment:** [Vercel](https://vercel.com/) (Static web export)

## 💻 Local Development Setup

To run this project locally on your machine, follow these steps:

### Prerequisites
Ensure you have Node.js and npm installed.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ANC-app.git
cd ANC-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server (Web)
```bash
npx expo start --web --port 8081
```
*Open your browser and navigate to `http://localhost:8081`.*

## 📦 Build and Deployment (Vercel)

The app is configured to be exported as a static web application and hosted on Vercel.

### 1. Test the web export locally
```bash
npx expo export -p web
```
*This bundles the app into the `dist/` directory.*

### 2. Deploy to Vercel Production
If you have the Vercel CLI installed and configured:
```bash
npx vercel --prod
```

## 📂 Project Structure

- `App.jsx` - Main entry point and authentication state manager.
- `src/screens/` - Core application screens (`WelcomeScreen`, `SignInScreen`, `DashboardScreen`, `BranchScreen`, `ServicesScreen`, `MoneyScreen`, etc.).
- `src/components/` - Reusable UI components (`Header`, `Button`, `Field`, `Icons`, etc.).
- `src/theme/` - Color palettes and styling constants.
- `src/assets/` - Images and static assets.

## 📄 License
This project is proprietary.
