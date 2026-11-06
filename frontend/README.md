# Chemical Process AI - Frontend

Interactive dashboard for the Chemical Process AI project, built with Next.js, React, TypeScript, and Recharts.

## Features

- Methane compressibility factor prediction.
- Machine Learning and Peng-Robinson EOS comparison.
- Model evaluation metrics visualization.
- Residual analysis and error inspection.
- Generalization and extrapolation performance reporting.
- Integration with the FastAPI backend.

## Requirements

- Node.js
- npm
- Running Chemical Process AI FastAPI backend

## Installation

From the project root, navigate to the frontend directory:

```bash
cd frontend
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Production Build

```bash
npm run build
npm run start
```

## Code Quality

Run ESLint:

```bash
npm run lint
```

Check TypeScript:

```bash
npx tsc --noEmit
```

## Backend Connection

The frontend communicates with the FastAPI backend to retrieve predictions, model evaluation results, pressure curves, and residual analysis.

Start the backend separately from the project root:

```bash
uvicorn app.main:app --reload
```

Backend API documentation: http://127.0.0.1:8000/docs