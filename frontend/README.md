# Decrypto Deploy Wizard - Frontend

A "Cinematic/Villain" dark aesthetic deployment suite for smart contracts.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.local.example` to `.env.local`.
   - Fill in your `NEXT_PUBLIC_WIZARD_FACTORY_ADDRESS`.
   - Fill in your Firebase project credentials.

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Key Features
- **Command Center**: Deploy `WizardFactory` heists (tokens + vesting).
- **Vault Archive**: Real-time Firestore sync of all past deployments.
- **Villain UI**: Deep blacks, neon crimson/emerald/cyan accents, and glassmorphism.

## Tech Stack
- Next.js 14 (App Router)
- Ethers.js v6
- Firebase Firestore
- Framer Motion
- Tailwind CSS
- Lucide React
