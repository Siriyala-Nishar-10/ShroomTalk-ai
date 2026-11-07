# ShroomTalk

**ShroomTalk** is an intelligent platform providing mushroom cultivation advice, RAG-driven knowledge base queries, and financial/subsidy scheme guidance.

---

## Project Structure

```text
ShroomTalk/
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Application pages/views
│   │   ├── services/         # API services and client integrations
│   │   └── App.jsx           # Root application component
│   └── package.json          # Frontend dependencies and scripts
│
├── backend/
│   ├── app/
│   │   ├── api/              # API routes and endpoints
│   │   ├── rag/              # Retrieval-Augmented Generation pipeline & embeddings
│   │   ├── finance/          # Financial planning, subsidy & cost calculators
│   │   ├── database/         # DB models, sessions, and migrations
│   │   └── main.py           # FastAPI application entrypoint
│   └── requirements.txt      # Python dependencies
│
├── knowledge_base/
│   ├── schemes/              # Government schemes and subsidy documents
│   └── cultivation/          # Mushroom cultivation guides and datasets
│
├── tests/                    # Unit and integration tests
├── docs/                     # Project documentation and architecture guides
├── .env.example              # Sample environment variables
└── README.md                 # Project README
```

---

## Getting Started

### 1. Environment Configuration

Copy the sample environment file and configure variables:
```bash
cp .env.example .env
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend server will run on `http://localhost:8000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
