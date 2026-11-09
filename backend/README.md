# ShroomTalk-AI Backend

FastAPI backend for ShroomTalk-AI, a financial and business advisory project for rural mushroom-farming entrepreneurs.

## Technology

- FastAPI and Pydantic for the API and data validation
- PostgreSQL, hosted through Supabase
- SQLAlchemy and Alembic for database models and migrations
- pgvector for scheme-document embeddings
- NumPy for deterministic financial calculations
- Gemini SDK is installed; the Gemini/RAG assistant is not connected yet

## Current implementation status

Implemented:

- API root, Swagger documentation, and database-aware health check
- Configurable frontend CORS origins
- PostgreSQL connection loaded from `backend/.env`
- SQLAlchemy model definitions for profiles, chat sessions and messages, calculation records, and scheme documents
- A pgvector embedding column in the scheme-document model

The models are defined, but the initial Alembic migration still needs to be generated and applied before the tables exist in PostgreSQL.

Not implemented yet:

- Authentication
- Profile, chat, scheme, and calculator API endpoints
- Gemini-powered answers, document ingestion, and RAG retrieval

The current chat/login UI should therefore be treated as a frontend demo, not live AI or real authentication.

## Local setup — Windows PowerShell

From the repository root:

```powershell
cd .\backend

if (-not (Test-Path .venv)) {
    py -m venv .venv
}

.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
}
```

Edit `backend/.env` and set `DATABASE_URL` to your Supabase PostgreSQL connection URI. Keep the URI and all API keys private. If the database password contains special characters, URL-encode them in the URI.

`backend/.env.example` is a safe template with blank secrets. It may be committed; **`backend/.env` must never be committed**.

## Supabase and PostgreSQL

1. Enable the `vector` extension in the Supabase project.
2. Put the PostgreSQL connection URI in `DATABASE_URL` in `backend/.env`.
3. Keep `sqlalchemy.url` blank in `alembic.ini`. Alembic reads the connection from `DATABASE_URL`.

You do not need the `psql` command-line tool to run the API or migrations.

## Database migrations

The first migration creates the tables from the SQLAlchemy models. Run this once when `migrations/versions` contains no migration file:

```powershell
python -m alembic revision --autogenerate -m "create initial project tables"
python -m alembic upgrade head
```

For subsequent setups or after pulling migrations from GitHub, apply existing migrations with:

```powershell
python -m alembic upgrade head
```

Do not generate another initial migration if one already exists.

## Run the API

From the `backend` directory, with the virtual environment activated:

```powershell
python -m uvicorn app.main:app --reload
```

Open:

- API root: <http://127.0.0.1:8000/>
- Swagger API docs: <http://127.0.0.1:8000/docs>
- Health check: <http://127.0.0.1:8000/api/v1/health>

The health check reports `database: "connected"` when PostgreSQL is reachable. If the database is not configured, it reports `not_configured`; if a configured connection fails, it reports `unavailable`.

## Security

- Keep database passwords, Supabase keys, and Gemini API keys in `backend/.env`.
- Never place secrets in frontend code, `alembic.ini`, or GitHub.
- Never commit `backend/.env` or local password files.
- If a credential is exposed, reset or rotate it.
