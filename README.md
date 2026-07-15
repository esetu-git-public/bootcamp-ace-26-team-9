# Employee Attrition Prediction System 🚀

An enterprise-grade, full-stack **AI-Powered Employee Retention Intelligence Platform** designed to predict workforce attrition risks, explain underlying behavioral drivers with **SHAP/LIME Explainable AI**, simulate retention interventions with an **interactive What-If Sandbox**, and provide actionable HR recommendations.

---

## 🌟 Premium Retention Intelligence Features

- **Automated ML Model Benchmarking & Selection**: Trains, benchmarks, and automatically promotes the best supervised model among **Logistic Regression, XGBoost, Random Forest, Decision Tree, and Gradient Boosting**.
- **SHAP/LIME Explainable AI Breakdown**: Provides granular feature attribution showing the exact positive or negative percentage impact (+/- risk contribution) of each behavioral driver.
- **Employee Risk Score (0–100) & Confidence Gauge**: Delivers intuitive risk scores alongside color-coded risk tiers (`High Risk`, `Medium Risk`, `Low Risk`).
- **Interactive What-If Retention Simulator**: Lets HR executives experiment with compensation adjustments, overtime schedules, and job satisfaction improvements to compute instantaneous risk reduction deltas (`POST /predict/what-if`).
- **Personalized HR Retention Action Plan**: Automatically maps behavioral risk factors to targeted retention strategies.
- **Bulk CSV Upload & Batch Prediction**: Evaluate entire workforce rosters (`POST /predict/csv`) with automated CSV output generation.
- **Downloadable Executive Reports**: One-click CSV/PDF export of workforce attrition diagnostics (`GET /reports/export/csv`).
- **Role-Based JWT Security**: Supports Admin, HR, and Manager access tiers with guest development fallback.
- **Modern Glassmorphism UI**: High-polish dark/light dashboard built with React 18 & Vite.

---

## 📋 System Architecture & Overview

Employee turnover creates significant financial and operational burdens for enterprises. The **Employee Attrition Prediction System** combines state-of-the-art predictive ML modeling trained on comprehensive HR analytics datasets with a sleek, responsive HR management interface.

### ✨ Key Capabilities
- **Real-Time Attrition Diagnosis**: Evaluates employee risk profiles instantly via FastAPI REST endpoints.
- **Enriched Risk Intelligence**: Returns not just a binary prediction, but also:
  - **Probability & Model Confidence Score** (`%`)
  - **Risk Tier Badge** (`Low`, `Medium`, `High`)
  - **Top Contributing Risk Factors** (e.g., `OverTime`, `Monthly Income`, `Job Satisfaction`)
  - **Personalized HR Recommendations** tailored to the employee's specific risk drivers.
- **Batch CSV Evaluation**: Process entire departments or enterprise rosters via `/predict/csv`.
- **Comprehensive Audit & History**: Persists predictions, training history, user accounts, and audit logs using SQLAlchemy.

---

## 🛠️ Technology Stack

### **Backend Service (`backend/`)**
- **FastAPI (v0.110+)** – High-performance asynchronous Python REST API framework with automatic OpenAPI documentation.
- **SQLAlchemy (v2.0+)** – Robust ORM for persistence across SQLite / PostgreSQL.
- **Pydantic (v2+)** – Strict schema validation and serialization.
- **JWT Authentication & Bcrypt** – Stateless secure token-based authentication and salted password hashing.

### **Machine Learning Pipeline (`ml/`)**
- **Scikit-learn & XGBoost** – Automated training across 5 supervised classification algorithms.
- **Automated Benchmarking** – Evaluates Accuracy, Precision, Recall, F1-Score, and ROC-AUC, automatically promoting the highest-performing algorithm.
- **Joblib & JSON Serialization** – Production model artifacts (`model.pkl`, `scaler.pkl`, `model_metadata.json`).

### **Frontend Application (`frontend/`)**
- **React 18 + Vite** – Fast SPA architecture with hot module replacement.
- **Tailwind CSS v3** – Clean, accessible HR dashboard styling with responsive layouts.
- **Lucide Icons & Recharts** – Visual analytics, charts, and diagnostic cards.

---

## 📊 Machine Learning Model Benchmarking

The ML pipeline (`ml/train.py`) trains and compares 5 distinct supervised learning models using stratified splitting and feature engineering:

| Algorithm | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression** | **0.6190** | **0.3846** | **0.6098** | **0.4717** | **0.6763** |
| **XGBoost** | 0.6463 | 0.3942 | 0.5000 | 0.4409 | 0.6333 |
| **Random Forest** | 0.7245 | 0.5122 | 0.2561 | 0.3415 | 0.6573 |
| **Decision Tree** | 0.5782 | 0.3250 | 0.4756 | 0.3861 | 0.5920 |
| **Gradient Boosting** | 0.6905 | 0.4082 | 0.2439 | 0.3053 | 0.6217 |

> *The best model is automatically serialized along with feature preprocessors to `ml/model.pkl` for immediate API serving.*

---

## 📂 Professional Project Structure

```
Employee-Attrition-Prediction/
│
├── backend/                  # Production FastAPI application
│   ├── api/                  # REST API routes (prediction, batch, auth)
│   ├── auth/                 # JWT handler & bcrypt password security
│   ├── database/             # SQLAlchemy ORM models, session & CRUD
│   ├── schemas/              # Pydantic request/response schemas
│   ├── services/             # Prediction inference & batch processing
│   ├── main.py               # FastAPI entrypoint & middleware setup
│   └── requirements.txt      # Clean backend dependencies
│
├── ml/                       # Machine Learning training & inference engine
│   ├── preprocessing.py      # Feature engineering & scaling pipelines
│   ├── train.py              # 5-Model training & benchmarking script
│   ├── evaluation.py         # Evaluation metrics & visualization charts
│   ├── predict.py            # Enriched inference & recommendation engine
│   ├── model.pkl             # Serialized production model artifact
│   └── scaler.pkl            # Serialized feature scaler artifact
│
├── frontend/                 # React 18 + Vite web dashboard
│   ├── src/
│   │   ├── pages/            # Dashboard, Prediction Form, Analytics
│   │   ├── components/       # Reusable UI widgets & layout components
│   │   └── api/              # Axios API client configured for FastAPI
│   └── package.json
│
├── tests/                    # Production verification & test suite
│   └── test_production_system.py
│
├── dataset/                  # IBM HR Analytics source data
└── README.md                 # System documentation
```

---

## 🚀 Installation & Quick Start

### 1. Environment Setup & ML Training
Create a virtual environment, install backend packages, and train the production ML pipeline:

```bash
# Activate virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Train models & generate artifacts
python ml/train.py
```

### 2. Start the FastAPI Backend Server
Start the API server on `http://127.0.0.1:8000`:

```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
> **API Documentation**: Visit `http://127.0.0.1:8000/docs` for interactive Swagger UI documentation.

### 3. Start the Frontend Dashboard
Open a new terminal in the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```
> Access the web UI at `http://localhost:5173`.

---

## 🧪 Testing & Verification

Run the end-to-end verification suite to validate database initialization, ML inference engine, and FastAPI endpoints:

```bash
python tests/test_production_system.py
```

---

## 🌐 Production Cloud Deployment (Vercel + Render)

The application is pre-configured for automated cloud deployment:

### **1. Backend Deployment (Render / Railway)**
- The repository includes a production `render.yaml` specification file.
- Connect your GitHub repository to Render as a Web Service.
- Build Command: `pip install -r backend/requirements.txt`
- Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### **2. Frontend Deployment (Vercel / Netlify)**
- The `frontend/` directory includes a `vercel.json` rewrite configuration for React Single Page Application (SPA) routing.
- Import the `frontend/` root into Vercel.
- Build Command: `npm run build`
- Output Directory: `dist`

---

## 🔒 Security & Best Practices
- **Environment Management**: Configuration parameters are managed via `.env`.
- **API Security**: CORS middleware restricts unauthorized origins; endpoints support JWT bearer tokens.
- **Graceful Fault Tolerance**: Frontend client includes resilient offline fallback heuristics for seamless testing and demonstrations.

