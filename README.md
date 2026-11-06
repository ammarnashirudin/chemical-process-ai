# Chemical Process AI

An AI-powered chemical engineering platform for methane compressibility factor (Z) prediction using Machine Learning, with comparison against the Peng-Robinson Equation of State (PR-EOS).

## Project Overview

The compressibility factor (Z) describes the deviation of a real gas from ideal gas behavior. It is an important property in chemical engineering calculations and thermodynamic modeling.

This project develops a Random Forest regression model using methane compressibility data generated from PR-EOS. The model serves as a machine learning surrogate to approximate reference thermodynamic calculations.

**Scientific scope:** The model learns from PR-EOS-generated data. Its performance measures agreement with EOS reference data, not accuracy against experimental measurements.

## Key Features

- Methane compressibility factor prediction.
- Machine Learning and PR-EOS comparison.
- Pressure-dependent prediction curves.
- Model evaluation and performance metrics.
- Residual analysis and error inspection.
- Generalization and extrapolation evaluation.
- FastAPI backend and interactive Next.js dashboard.

## Technology Stack

**Backend and Machine Learning**
- Python
- FastAPI
- Scikit-learn
- NumPy
- Pandas
- Joblib
- Pytest

**Frontend**
- Next.js
- React
- TypeScript
- Recharts
- Tailwind CSS

## Project Structure

```text
chemical-process-ai/
├── app/
│   └── main.py
├── data/
│   └── processed/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── types/
├── models/
├── reports/
│   └── figures/
├── src/
│   ├── models/
│   └── thermodynamics/
├── tests/
├── requirements.txt
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ammarnashirudin/chemical-process-ai.git
cd chemical-process-ai
```

### 2. Set up Python environment

```bash
python -m venv .venv
```

Activate on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

### 3. Run the backend

From the project root:

```bash
uvicorn app.main:app --reload
```

Backend: http://127.0.0.1:8000

API documentation: http://127.0.0.1:8000/docs

### 4. Run the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000

## Testing

Run the backend test suite from the project root:

```bash
python -m pytest -v
```

## API Endpoints

| Endpoint | Purpose |
|---|---|
| `/health` | Backend health check |
| `/predict` | Predict methane compressibility factor |
| `/compare` | Compare ML prediction with PR-EOS |
| `/pressure-curve` | Generate pressure-dependent predictions |
| `/evaluation` | Retrieve model evaluation metrics |
| `/residuals` | Retrieve residual analysis data |

## Model Limitations

- The model is trained on data generated using PR-EOS.
- Predictions outside the training domain may be less reliable.
- Agreement with PR-EOS does not establish experimental accuracy.
- Experimental validation is required before using the model for engineering design or operational decisions.

## Author

Muhammad Ammar Nashirudin

Chemical Engineering | AI and Machine Learning | Process Modeling