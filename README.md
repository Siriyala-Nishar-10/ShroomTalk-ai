# 🍄 ShroomTalk-AI

**AI-driven business guidance, financial structuring, and hyper-local advisory platform for rural mushroom micro-entrepreneurs.**

ShroomTalk-AI is a full-stack web application designed to help mushroom farmers and small rural enterprises explore cultivation costs, loan repayments, business viability, government schemes, and cultivation-related questions. It combines a robust FastAPI backend, a React/Vite frontend, PostgreSQL-backed application data, and Gemini-powered assistant capabilities.

> **Project status:** Active development. Features and setup may change as the project evolves. Information from the assistant is for general guidance only—not a bank decision, financial advice, or a substitute for official scheme requirements.

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

The project is built around these core modules:

- Farmer account, authentication, and user profile management
- Gemini-powered AI assistant for enterprise queries, troubleshooting, and scheme-related guidance
- Government agricultural and micro-enterprise scheme information catalog
- Loan and EMI calculations tailored for rural banking options
- Cultivation cost estimates (spawn, substrate, polybags, steam sterilization)
- Business viability & break-even estimates
- Calculation and interactive chat history logs
- Knowledge-base administration and vernacular localization support

Availability and completeness of individual features depend on the current deployment and project state.

## Technology

| Area    | Technologies                                                              |
| ------- | ------------------------------------------------------------------------- |
| Frontend| React, Vite, CSS, Responsive UI                                           |
| Backend | Python, FastAPI, Pydantic, SQLAlchemy                                     |
| Database| PostgreSQL; Supabase Postgres integration supported                       |
| AI      | Google Gemini API; retrieval-augmented generation (RAG) capabilities      |
| Hosting | Render (API web service and static frontend) or Vercel (frontend)         |

## Project structure

```text
ShroomTalk-ai/
├── backend/
│   ├── app/
│   │   ├── api/routes/        # API endpoints (Auth, AI, Schemes, Calculator)
│   │   ├── core/              # Configuration & security settings
│   │   ├── db/                # Database models and session management
│   │   ├── services/          # Assistant and scheme services
│   │   └── main.py            # FastAPI application entrypoint
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api.js             # Frontend API client
│   │   ├── App.jsx            # Main React application component
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── .env.example
└── README.md
```

## Prerequisites

- Git
- Python 3.11 or later
- Node.js and npm
- A PostgreSQL database for backend data persistence
- A Gemini API key for assistant responses

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

The API will be available at `http://127.0.0.1:8000`. Interactive API documentation is accessible at `http://127.0.0.1:8000/docs`.

### 3. Configure and run the frontend

In a separate terminal window:

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

Open the local URL printed by Vite, typically `http://localhost:5173`.

## Environment variables

Set secrets in local environment files or your hosting provider's environment settings. Never commit real credentials to GitHub or expose server secrets in frontend variables.

### Backend

| Variable                  | Purpose                                                                                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`            | PostgreSQL connection URI used by SQLAlchemy. Use a secure database URI; for Supabase on hosts without IPv6 connectivity, use Supabase's Session Pooler URI. |
| `JWT_SECRET`              | Long, random secret used to sign authentication tokens. Set a stable secret in production.                                                                 |
| `FRONTEND_ORIGINS`        | JSON array of permitted browser origins, e.g. `["http://localhost:5173"]`. Add the deployed frontend origin in production.                                 |
| `GEMINI_API_KEY`          | Gemini API key for assistant features.                                                                                                                     |
| `GEMINI_MODEL`            | Optional Gemini model override.                                                                                                                          |
| `SUPABASE_URL`            | Optional Supabase project URL where used by the application.                                                                                               |
| `SUPABASE_ANON_KEY`       | Optional Supabase public/anonymous key where used.                                                                                                         |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional server-only Supabase service key. Never expose this in the frontend.                                                                            |

### Frontend

| Variable            | Purpose                                                                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Base URL of the deployed API, e.g. `https://shroomtalk-ai-xqcx.onrender.com`. Vite variables are included in the build; do not put private secrets here. |

## API

The backend API prefix is `/api/v1`.

- `GET /` — API welcome message
- `GET /api/v1/health` — API and database health status
- `/docs` — Interactive OpenAPI documentation

## Deploy

### Backend on Render

Create a **Web Service** connected to this repository:

- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Add backend environment variables in Render (`DATABASE_URL`, `JWT_SECRET`, `FRONTEND_ORIGINS`, `GEMINI_API_KEY`).

### Frontend on Render (Live Demo)

The live application is accessible at [https://shroomtalk-ai-xqcx.onrender.com/](https://shroomtalk-ai-xqcx.onrender.com/).

Create a **Static Site** connected to the repository:

- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- Build environment variable: `VITE_API_BASE_URL=https://shroomtalk-ai-xqcx.onrender.com`

## Security notes

- Never commit `.env`, database connection strings, API keys, JWT secrets, or service-role keys.
- Use HTTPS for production deployments and restrict allowed browser origins via `FRONTEND_ORIGINS`.
- Confirm current government scheme rules and financial terms with official sources.

## Team

Department of Computer Science and Engineering  
HKBK College of Engineering  
Academic year: 2026–2027  
Project: BCS586 – Mini Project (5th Semester)

---

**ShroomTalk-AI — empowering rural mushroom entrepreneurs through accessible digital tools.** 🍄
