from types import SimpleNamespace

from fastapi.testclient import TestClient

from app.main import app
from app.services.rag import build_prompt, keyword_search, system_instruction
from app.services.seed_data import SCHEMES

client = TestClient(app)

DOCS = [
    SimpleNamespace(scheme_code=scheme["code"], title=title, content=content)
    for scheme in SCHEMES
    for title, content in scheme["texts"].values()
]


def test_keyword_search_english():
    assert keyword_search(DOCS, "mudra loan")[0] == "mudra"


def test_keyword_search_no_match():
    assert keyword_search(DOCS, "xyzzy") == []


def test_keyword_search_hindi():
    assert keyword_search(DOCS, "मुद्रा") == ["mudra"]


def test_prompt_and_instruction():
    prompt = build_prompt("Is this allowed?", [("Title A", "Text A", "https://example.com")])
    assert "Is this allowed?" in prompt
    assert "[1] Title A" in prompt
    assert "Hindi" in system_instruction("hi")


def test_chat_rejects_blank_message():
    response = client.post("/api/v1/chat", json={"message": "   ", "language": "en"})
    assert response.status_code == 422


def test_chat_history_requires_sign_in():
    assert client.get("/api/v1/chat/history").status_code == 401