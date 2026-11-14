# 🍄 ShroomTalk-AI

**AI-driven business guidance and financial planning for rural mushroom micro-entrepreneurs.**

ShroomTalk-AI is a web application intended to help mushroom farmers and small rural enterprises explore cultivation costs, loan repayments, business viability, government schemes, and cultivation-related questions. It combines a FastAPI backend, a React/Vite frontend, PostgreSQL-backed application data, and Gemini-powered assistant capabilities.

> **Project status:** Under development. Features and setup may change as the project evolves. Information from the assistant is for general guidance only—not a bank decision, financial advice, or a substitute for official scheme requirements.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Run locally](#run-locally)
- [Environment variables](#environment-variables)
- [API](#api)
- [Deploy](#deploy)
- [Security notes](#security-notes)
- [Team](#team)

## Features

The project is being developed around these modules:

- Farmer account, authentication, and profile
- AI assistant for mushroom enterprise and scheme-related questions
- Government scheme information
- Loan and EMI calculations
- Cultivation cost estimates
- Business viability estimates
- Calculation and chat history
- Recommendations and reports (planned / evolving)
- Knowledge-base administration (planned / evolving)

Availability and completeness of individual features depend on the current deployment and project state.

## Technology

| Area     | Technologies                                                              |
| -------- | ------------------------------------------------------------------------- |
| Frontend | React, Vite, CSS                                                          |
| Backend  | Python, FastAPI, Pydantic, SQLAlchemy                                     |
| Database | PostgreSQL; Supabase Postgres can be used                                 |
| AI       | Google Gemini API; retrieval-augmented capabilities are under development |
| Hosting  | Render (API and static frontend) or Vercel (frontend)                     |

## Project structure

```text
ShroomTalk-ai/
├── backend/
│   ├── app/
│   │   ├── api/routes/       # API endpoints
│   │   ├── core/             # Configuration
│   │   ├── db/               # Database models and sessions
│   │   ├── services/         # Assistant and scheme services
│   │   └── main.py           # FastAPI application
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api.js            # Frontend API client
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── .env.example
└── README.md
```

The exact contents may change as development continues.

## Prerequisites

- Git
- Python 3.11 or later
- Node.js and npm
- A PostgreSQL database for backend features that require persistence
- A Gemini API key for Gemini-powered assistant responses

## Run locally

### 1. Clone the repository

```bash
git clone https://github.com/Siriyala-Nishar-10/ShroomTalk-ai.git
cd ShroomTalk-ai
```

### 2. Configure the backend

Create `backend/.env` (or configure environment variables in your shell) with the settings described in [Environment variables](#environment-variables). Do not commit this file.

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

```powershell
# Windows PowerShell
.venv\Scripts\Activate.ps1
```

```bash
# macOS / Linux
source .venv/bin/activate
```

Install dependencies and start FastAPI:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`. Interactive API documentation is at `http://127.0.0.1:8000/docs`.

### 3. Configure and run the frontend

In a second terminal:

```bash
cd ShroomTalk-ai/frontend
npm install
```

Create `frontend/.env.local` with the backend URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Environment variables

Set secrets in local environment files or your hosting provider's environment settings. Never commit real credentials to GitHub or expose server secrets in frontend variables.

### Backend

| Variable                    | Purpose                                                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`              | PostgreSQL connection URI used by SQLAlchemy. Use a secure database URI; for Supabase on hosts without IPv6 connectivity, use Supabase's Session Pooler URI. |
| `JWT_SECRET`                | Long, random secret used to sign authentication tokens. Set a stable secret in production.                                                                   |
| `FRONTEND_ORIGINS`          | JSON array of permitted browser origins, e.g. `["http://localhost:5173"]`. Add the deployed frontend origin in production.                                   |
| `GEMINI_API_KEY`            | Gemini API key for assistant features.                                                                                                                       |
| `GEMINI_MODEL`              | Optional Gemini model override.                                                                                                                              |
| `SUPABASE_URL`              | Optional Supabase project URL where used by the application.                                                                                                 |
| `SUPABASE_ANON_KEY`         | Optional Supabase public/anonymous key where used.                                                                                                           |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional server-only Supabase service key. Never expose this in the frontend.                                                                                |

The backend configuration has development defaults for some settings. Production deployments should explicitly set the required secrets and database URL. A valid `DATABASE_URL` must be a plain PostgreSQL URI, such as `postgresql://...`; use the exact username, host, port, and database name supplied by your provider. Passwords containing reserved URL characters must be URL-encoded. Do not include Markdown formatting or square brackets around the URI.

### Frontend

| Variable            | Purpose                                                                                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Base URL of the deployed API, e.g. `https://your-api.onrender.com`. Vite variables are included in the built frontend; do not put private secrets in them. |

After changing a `VITE_` variable in Vercel or Render, rebuild/redeploy the frontend.

## API

The backend API prefix is `/api/v1`.

- `GET /` — API welcome message
- `GET /api/v1/health` — API and database health status
- `/docs` — interactive OpenAPI documentation

Other routes cover authentication, profiles, schemes, calculations, and chat. See `/docs` for the current endpoints and request schemas.

A health response with `"database":"unavailable"` indicates that the backend is running but cannot connect to PostgreSQL. Check the backend logs and database URI in the hosting provider; do not place credentials in issue reports or chat messages.

## Deploy

The frontend and backend are separate services. Deploy both from the same GitHub repository, selecting the branch that contains the code you want to publish.

### Backend on Render

Create a **Web Service** connected to this repository:

- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Add backend environment variables in Render (at minimum, configure a production `DATABASE_URL`, `JWT_SECRET`, and `FRONTEND_ORIGINS`; add `GEMINI_API_KEY` for Gemini features).

For `FRONTEND_ORIGINS`, use a JSON array containing the exact deployed frontend origin, for example:

```text
["https://your-frontend.onrender.com"]
```

Do not add a trailing slash to the origin. If using both a Render and Vercel frontend, list both origins in the array.

### Frontend on Render

Create a **Static Site** connected to the repository:

- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- Build environment variable: `VITE_API_BASE_URL=https://your-api.onrender.com`

After the static site is deployed, add its exact `https://...onrender.com` origin to the backend's `FRONTEND_ORIGINS` and redeploy the backend if required.

### Frontend on Vercel (alternative)

Import the repository as a Vercel project and configure:

- **Root Directory:** `frontend`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- Environment variable: `VITE_API_BASE_URL=https://your-api.onrender.com`

Add the Vercel deployment origin to backend `FRONTEND_ORIGINS`. Redeploy the frontend after changing its environment variable.

## Security notes

- Never commit `.env`, database connection strings, API keys, JWT secrets, or Supabase service-role keys.
- If a credential is accidentally shared or committed, rotate/revoke it immediately and update the hosting environment.
- Only expose public client keys to browser code; keep database and service-role credentials on the backend.
- Use HTTPS for production deployments and allow only the frontend origins you control.
- Confirm current government scheme rules and financial terms with official sources.

## Team

Department of Computer Science and Engineering  
HKBK College of Engineering  
Academic year: 2026–2027  
Project: BCS586 – Mini Project (5th Semester)

---

**ShroomTalk-AI — empowering rural mushroom entrepreneurs through accessible digital tools.** 🍄
