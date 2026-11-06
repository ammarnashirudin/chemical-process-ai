from src.models.train_models import (
    build_models,
    evaluate_model,
)

def test_all_three_models_are_available():
    models = build_models()

    assert set(models) == {
        "linear_regression",
        "random_forest",
        "gradient_boosting",
    }

def test_evaluation_metrics_are_finite():
    y_true = [0.90, 0.95, 1.00, 1.05]
    y_pred = [0.91, 0.94, 1.01, 1.04]

    metrics = evaluate_model(y_true, y_pred)

    assert metrics["mae"] >= 0
    assert metrics["rmse"] >= 0
    assert all(
        value == value and abs(value) < float("inf")
        for value in metrics.values()
    )

def test_perfect_predictions_have_zero_error():
    values = [0.90, 1.00, 1.10]

    metrics = evaluate_model(values, values)

    assert metrics["mae"] == 0
    assert metrics["rmse"] == 0
    assert metrics["r2"] == 1
