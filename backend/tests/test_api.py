from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_loan_endpoint_signed_out():
    response = client.post(
        "/api/v1/calculations/loan",
        json={"principal": 100000, "annual_rate_percent": 12, "tenure_months": 12},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["saved"] is False
    assert abs(body["result"]["monthly_emi"] - 8884.88) < 0.01


def test_loan_endpoint_rejects_bad_input():
    response = client.post(
        "/api/v1/calculations/loan",
        json={"principal": -5, "annual_rate_percent": 12, "tenure_months": 12},
    )
    assert response.status_code == 422


def test_history_requires_sign_in():
    assert client.get("/api/v1/calculations/history").status_code == 401


def test_me_requires_sign_in():
    assert client.get("/api/v1/auth/me").status_code == 401