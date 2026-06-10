# MedAssist — AI-Powered Healthcare Management System

 My YouTube link for the project is: https://youtu.be/Qksoe5svm7o?si=bBjx8L4G8J-STBFw

**MedAssist** is a full-stack healthcare platform that supports medication adherence, intelligent reminders, AI guidance, and payment workflows for patient care.

## Project Overview

MedAssist combines a React frontend, an Express backend API, and an AI microservice to deliver:
- medication scheduling and reminders
- adherence tracking and reporting
- multilingual support (English and Swahili)
- SMS notifications and M-Pesa payments
- role-based experiences for patients, caregivers, and admins

## Architecture

The repository is organized as a monorepo with three main services:

- `medassistai/client`
  - React + Vite frontend
  - responsive patient and caregiver UI
  - localization, charts, and interaction flows

- `medassistai/server`
  - Node.js + Express backend
  - MongoDB persistence via Mongoose
  - authentication, medication, notification, and payment logic

- `medassistai/fadhili-ai`
  - AI microservice for medication guidance
  - knowledge-base driven recommendations and conversational support

## Repository Structure

```text
medassistai/
  ├─ client/         # React frontend application
  ├─ server/         # Express backend API
  ├─ fadhili-ai/     # AI recommendation service
  ├─ package.json    # monorepo workspace scripts
```

## Key Features

- medication reminders and adherence tracking
- AI-powered medication guidance
- secure authentication and user roles
- SMS reminders via Africa's Talking
- M-Pesa payment integration
- multi-language support

## Prerequisites

- Node.js 18.x
- npm or Yarn
- MongoDB instance (local or Atlas)
- Optional: Africa's Talking credentials
- Optional: M-Pesa / Daraja credentials
- Optional: Gemini/OpenAI API key

## Install Dependencies

From the root of the repository:

```powershell
cd medassistai
yarn install
```

Or install each service separately:

```powershell
cd medassistai/server
yarn install
cd ..\client
yarn install
cd ..\fadhili-ai
yarn install
```

## Environment Configuration

Each service uses a `.env` file. Copy the example file and configure values for your environment.

```powershell
cd medassistai/server
copy .env.example .env

cd ..\client
copy .env.example .env

cd ..\fadhili-ai
copy .env.example .env
```

### Recommended Environment Variables

#### Backend (`medassistai/server`)
- `MONGODB_URI`
- `DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `JWT_COOKIE_EXPIRE`
- `FADHILI_API_URL`
- `GEMINI_API_KEY`
- `AT_API_KEY`
- `AT_USERNAME`
- `AT_SENDER_ID`
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_PASSKEY`
- `MPESA_SHORTCODE`
- `FRONTEND_URL`

#### Frontend (`medassistai/client`)
- `VITE_API_URL=http://localhost:5000/api`

#### AI Service (`medassistai/fadhili-ai`)
- `GEMINI_API_KEY`
- `FALLBACK_MODE`
- `CORS_ORIGIN=http://localhost:5173`

> Keep secrets out of source control and use secure environment management.

## Run Locally

### Full local development

```powershell
cd medassistai
yarn dev
```

### Individual services

Backend:

```powershell
cd medassistai/server
yarn dev
```

Frontend:

```powershell
cd medassistai/client
yarn dev
```

AI service:

```powershell
cd medassistai/fadhili-ai
yarn dev
```

## Service-Specific Setup

### Backend (`medassistai/server`)

1. Install dependencies:

```powershell
cd medassistai/server
yarn install
```

2. Copy `.env.example` to `.env`.
3. Configure MongoDB, JWT, AI, SMS, and payment credentials.
4. Start the backend:

```powershell
cd medassistai/server
yarn dev
```

### Frontend (`medassistai/client`)

1. Install dependencies:

```powershell
cd medassistai/client
yarn install
```

2. Copy `.env.example` to `.env`.
3. Set `VITE_API_URL` for your backend.
4. Start the frontend:

```powershell
cd medassistai/client
yarn dev
```

### AI Service (`medassistai/fadhili-ai`)

1. Install dependencies:

```powershell
cd medassistai/fadhili-ai
yarn install
```

2. Copy `.env.example` to `.env`.
3. Configure AI keys and CORS origin.
4. Start the AI service:

```powershell
cd medassistai/fadhili-ai
yarn dev
```

## Local Ports

- Backend API: `http://localhost:5000`
- Frontend app: `http://localhost:5173`
- AI service: `http://localhost:5001`

## Testing

Run backend tests from the server workspace:

```powershell
cd medassistai/server
yarn test
```

## Deployment

### Frontend

```powershell
cd medassistai/client
yarn build
```

Deploy the generated `dist/` folder to a static host or CDN.

### Backend

- Deploy `medassistai/server` as a Node.js service.
- Set `NODE_ENV=production`.
- Store secrets securely.
- Start with `yarn start`.

### AI Service

- Deploy `medassistai/fadhili-ai` separately.
- Update backend `FADHILI_API_URL` to the production AI endpoint.
- Configure production CORS for your frontend domain.

### Production Recommendations

- Use MongoDB Atlas or a managed database provider.
- Host services behind HTTPS.
- Use PM2, Docker, or a managed runtime for reliability.
- Monitor logs and protect API keys.

## Contributing

Contributions are welcome:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with a clear description
