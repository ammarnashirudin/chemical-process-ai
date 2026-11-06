import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "model_loaded": True,
    }


def test_predict_valid_input():
    response = client.post(
        "/predict",
        json={
            "temperature_K": 300,
            "pressure_Pa": 1_000_000,
        },
    )

    assert response.status_code == 200

    result = response.json()

    assert result["temperature_K"] == 300
    assert result["pressure_Pa"] == 1_000_000
    assert isinstance(result["predicted_Z"], float)
    assert result["model"] == "Random Forest Tuned"
    assert result["within_training_range"] is True
    assert result["warning"] is None


def test_predict_rejects_negative_temperature():
    response = client.post(
        "/predict",
        json={
            "temperature_K": -10,
            "pressure_Pa": 1_000_000,
        },
    )

    assert response.status_code == 422


def test_predict_rejects_zero_pressure():
    response = client.post(
        "/predict",
        json={
            "temperature_K": 300,
            "pressure_Pa": 0,
        },
    )

    assert response.status_code == 422


def test_predict_outside_training_range():
    response = client.post(
        "/predict",
        json={
            "temperature_K": 450,
            "pressure_Pa": 1_000_000,
        },
    )

    assert response.status_code == 200

    result = response.json()

    assert result["within_training_range"] is False
    assert result["warning"] is not None

def test_compare_pr_eos_and_ml():
    response = client.post(
        "/compare",
        json={
            "temperature_K" : 300,
            "pressure_Pa" : 1_000_000,
        },
    )

    assert response.status_code == 200

    result = response.json()

    assert result["model"] == "Random Forest Tuned"
    assert result["pr_eos_Z"] == pytest.approx(
        0.9786014255678372
    )

    assert isinstance(result["predicted_Z"], float)

    expected_error = abs(
        result["pr_eos_Z"] - result["predicted_Z"]
    )

    assert result["absolute_error"] == pytest.approx(
        expected_error
    )
