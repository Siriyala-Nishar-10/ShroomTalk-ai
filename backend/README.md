# ShroomTalk Backend

FastAPI backend for ShroomTalk.

## Run locally (Windows PowerShell)

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

Open:
- API root: http://127.0.0.1:8000/
- Swagger API docs: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/api/v1/health

Keep all secrets in `backend/.env`. Never expose the Supabase service-role key in frontend code or commit it to Git.
