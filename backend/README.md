Replace **`backend\README.md`** with the full text below. Open the file in VS Code, press **Ctrl+A**, paste the text, and save. **Do not paste it into PowerShell.**

````markdown
# ShroomTalk-AI Backend

FastAPI backend for ShroomTalk-AI, a project that helps mushroom farmers understand basic financial calculations and find information about relevant government schemes.

The backend provides login, profiles, scheme information, three deterministic calculators, and an assistant that searches stored scheme descriptions. It is an API used by the separate React frontend.

## What it does

- Creates accounts and signs users in with email and password.
- Stores profile details and, for signed-in users, calculation and chat history.
- Calculates loan EMIs, mushroom cultivation costs and revenue, and a basic business check.
- Lists five seeded schemes with official links and English, Hindi and Kannada descriptions.
- Answers scheme questions using stored scheme information. Gemini and pgvector are used when available; otherwise the assistant can return matching scheme excerpts.
- Reports whether the PostgreSQL database is reachable through the health endpoint.

**Calculators use ordinary, repeatable mathematics. They do not use AI.** The assistant is separate and must not be treated as a source of financial or eligibility decisions.

## Technology

| Technology             | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| FastAPI and Pydantic   | API routes and request validation                |
| PostgreSQL on Supabase | User, profile, scheme, chat and calculation data |
| SQLAlchemy and psycopg | PostgreSQL access                                |
| pgvector               | Similarity search for scheme information         |
| NumPy                  | Deterministic financial calculations             |
| Google Gemini          | Optional scheme-question answers and embeddings  |
| JWT and PBKDF2-SHA256  | Login tokens and password hashing                |

## Requirements

- Python 3.12 or newer is recommended for deployment.
- A PostgreSQL database. Supabase is the intended provider.
- The PostgreSQL `vector` extension for vector search.
- A Gemini API key is optional. Without it, the assistant can use keyword search and return matching excerpts.

## Local setup on Windows

Run these commands in PowerShell **from the repository root**. If `.venv` already exists, the first command leaves it alone. If the virtual environment is already active, you do not need to activate it again.

```powershell
if (-not (Test-Path .venv)) { py -m venv .venv }
.\.venv\Scripts\Activate.ps1
Set-Location backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt -r requirements-dev.txt
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Open `backend\.env` in VS Code and fill in the settings below. Never commit this file or share its contents.

### Environment variables

```dotenv
FRONTEND_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]
DATABASE_URL=
JWT_SECRET=
GEMINI_API_KEY=
```

- **`FRONTEND_ORIGINS`**: a JSON list of websites allowed to call the API from a browser.
- **`DATABASE_URL`**: the PostgreSQL connection string from Supabase. The backend accepts `postgres://` and `postgresql://` URLs and converts them for psycopg.
- **`JWT_SECRET`**: a long random value used to sign login tokens. Generate one with:
  ```powershell
  python -c "import secrets; print(secrets.token_urlsafe(48))"
  ```
  Put the result in `.env`. Set a stable value on Render too. If it is missing, the backend generates a temporary value; users will be logged out when the server restarts.
- **`GEMINI_API_KEY`**: optional. Keep it private. Do not paste it into source files or commit it.

If a database password contains special characters, URL-encode those characters in the connection string. If Render cannot connect to a direct Supabase database URL, try a Supabase pooler connection string.

The virtual environment in this repository is at the **repository root**. If you are already in the `backend` directory and need to activate it, use:

```powershell
..\.venv\Scripts\Activate.ps1
```

`.\.venv\Scripts\Activate.ps1` from the `backend` directory looks for a virtual environment inside `backend`, so it will fail if the environment is at the repository root.

## Run tests and start the API

Run these commands from the `backend` directory with the virtual environment active:

```powershell
python -m pytest -q
python -m uvicorn app.main:app --reload
```

The interactive API documentation is at:

- `http://127.0.0.1:8000/docs`

The health endpoint is at:

- `http://127.0.0.1:8000/api/v1/health`

A healthy response should report `"database": "connected"`. If the database is not configured or cannot be reached, database-backed routes such as schemes and chat will not work.

## Database setup and behavior

At startup, the application attempts to enable the `vector` extension, creates missing tables with SQLAlchemy, and seeds the scheme descriptions. With a Gemini key configured, it also attempts to create embeddings for scheme documents that do not have one.

The tables used by the application are:

- `users`
- `profiles`
- `chat_sessions`
- `chat_messages`
- `calculation_records`
- `scheme_documents`

The current backend uses `create_all()` at startup; it does **not** run Alembic migrations. `create_all()` creates missing tables but does not update the structure of tables that already exist. Use a proper migration if the database schema needs to change later. The Alembic files in the repository are not part of the current startup process.

## API routes

All API routes are under `/api/v1`. Requests and responses use JSON.

| Method | Route                              | Sign-in required? | Purpose                                        |
| ------ | ---------------------------------- | ----------------: | ---------------------------------------------- |
| `GET`  | `/`                                |                No | API welcome information                        |
| `GET`  | `/api/v1/health`                   |                No | API and database health                        |
| `POST` | `/api/v1/auth/register`            |                No | Register and receive a login token             |
| `POST` | `/api/v1/auth/login`               |                No | Sign in and receive a login token              |
| `GET`  | `/api/v1/auth/me`                  |               Yes | Get the signed-in user's account               |
| `GET`  | `/api/v1/profile`                  |               Yes | Read the user's profile                        |
| `PUT`  | `/api/v1/profile`                  |               Yes | Update the user's profile                      |
| `GET`  | `/api/v1/schemes`                  |                No | Search scheme descriptions                     |
| `POST` | `/api/v1/calculations/loan`        |                No | Calculate a loan EMI                           |
| `POST` | `/api/v1/calculations/cultivation` |                No | Estimate cultivation costs, revenue and profit |
| `POST` | `/api/v1/calculations/business`    |                No | Run a basic business check                     |
| `GET`  | `/api/v1/calculations/history`     |               Yes | Read saved calculations                        |
| `POST` | `/api/v1/chat`                     |                No | Ask a scheme-related question                  |
| `GET`  | `/api/v1/chat/history`             |               Yes | Read saved chat messages                       |

For signed-in requests, send:

```text
Authorization: Bearer <access_token>
```

### Authentication and profiles

Registration accepts an email, a password of at least eight characters, and optional display name and preferred language. The supported language codes are `en`, `hi` and `kn`.

Passwords are stored as PBKDF2-SHA256 hashes, not plain text. Login returns a JWT access token. The frontend should store and send that token for protected requests.

Profile fields include display name, farm name, village, district, state and preferred language.

### Schemes

Search schemes by language and optional search text:

```text
GET /api/v1/schemes?lang=hi&q=mudra
```

The seeded data includes PMFME, PMEGP, AIF, MUDRA and NHB. Each result has an official website link and a `verified` value. The seeded descriptions have not automatically been checked against the latest official rules. Treat a scheme as verified only after someone has checked it against its official source and its `source_checked_at` date has been updated.

### Calculators

Calculators work without signing in. When a signed-in user's calculation is successfully saved, the response includes `"saved": true`; otherwise it returns `"saved": false`.

Loan example:

```json
{
  "principal": 100000,
  "annual_rate_percent": 12,
  "tenure_months": 12
}
```

The response includes the monthly EMI, total payment, total interest and yearly breakdown.

The cultivation calculator accepts bag count, per-bag costs, other costs, expected yield, wastage and selling price. It returns expected production, costs, revenue, profit, break-even price and a selling-price sensitivity table.

The business calculator compares monthly revenue and operating costs with a loan EMI. Its `assessment` is a simple rule of thumb, not a bank's decision or a guarantee that a loan is affordable.

### Assistant and RAG

Chat request example:

```json
{
  "message": "Which scheme may support a small food-processing business?",
  "language": "en"
}
```

The response includes an `answer`, a `mode`, `sources` and a `saved` value.

- **`rag_gemini`**: Gemini produced an answer using retrieved scheme descriptions.
- **`retrieval_only`**: the response contains matching scheme excerpts, rather than a generated AI answer.
- **`no_match`**: no relevant scheme information was found.

The assistant searches only information stored in the database. It does not browse official websites or guarantee that scheme rules are current. Users should check the official source links before applying. Chat history is saved only for a signed-in user.

## Deploy the backend on Render

1. Push the backend code to GitHub.
2. Create a Render **Web Service** connected to the repository.
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path:** `/api/v1/health`
   - **Python version:** 3.12.7, if the Render settings allow it.
4. Add these private environment variables in Render:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `FRONTEND_ORIGINS`
5. Before the frontend is deployed, `FRONTEND_ORIGINS` can contain the local development origins. After the frontend is deployed, change it to a JSON list containing the exact Vercel website URL, then redeploy the backend.
6. Open `https://<your-render-service>.onrender.com/api/v1/health`. Confirm that the database reports `connected`, then check `/docs` and test the routes.

If the Render logs report a network connection problem to Supabase, use a Supabase pooler connection string and update `DATABASE_URL` in Render. Do not put database credentials in GitHub or this README.

The frontend should set `VITE_API_BASE_URL` to the Render service URL, without a trailing slash.

## Limitations and safety notes

- Scheme descriptions and their Hindi and Kannada translations need human review. They are not automatically verified by visiting official websites.
- Only set a scheme's `source_checked_at` after checking its information against the official source. If its text changes later, check it again.
- The assistant can only answer from scheme information stored in the database. Gemini output can still be wrong; check important details with the official source.
- There is no email verification, password reset or rate limiting. This backend has not had a production security review.
- Offline behavior, if implemented by the frontend, does not make the backend available while the server or database is offline.
- Do not commit `.env`, database passwords, JWT secrets, Gemini keys or user tokens. If a credential is exposed, replace it immediately.
````
