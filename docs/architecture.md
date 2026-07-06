# Employee Attrition Prediction System - Clean Architecture & Data Flow

This document outlines the architectural patterns and communication flows implemented within the **Employee Attrition Prediction System**.

---

## 🏗️ Architectural Diagram

```mermaid
graph TD
    subgraph Frontend [React.js + Vite Frontend (Port 5173)]
        UI[React UI Components]
        Context[AuthContext State]
        AxiosClient[Axios API Client]
        Recharts[Recharts Visualizations]
    end

    subgraph Backend [Flask REST API Server (Port 5000)]
        Routes[API Routes / Blueprints]
        PredService[Prediction Service]
        AnalService[Analytics Service]
    end

    subgraph ML [Machine Learning Engine]
        Model[XGBoost / Random Forest (model.pkl)]
        Scaler[StandardScaler Preprocessor (scaler.pkl)]
        Encoder[LabelEncoder Target (encoder.pkl)]
    end

    subgraph Data [Data Layer]
        CSV[IBM HR Analytics CSV (1,470 Records)]
    end

    UI -->|JSON HTTP Requests| AxiosClient
    AxiosClient -->|POST /predict, GET /dashboard| Routes
    Routes --> PredService
    Routes --> AnalService
    PredService -->|Load & Transform| Scaler
    PredService -->|Inference| Model
    AnalService -->|Read & Aggregate| CSV
    Model -->|Trained on| CSV
```

---

## 🔄 Clean Architecture Design

The system enforces separation of concerns across three distinct modular layers:

### 1. Presentation Layer (`frontend/`)
- Built as a reactive Single Page Application (SPA) using React 18 and Vite.
- Implements custom Tailwind CSS tokens for a cohesive **Blue and White HR Theme**.
- **AuthContext** isolates security and login state, ensuring all HR data routes (`/`, `/predict`, `/analytics`) are strictly protected from unauthenticated access.
- **API Client** centralizes Axios configuration with error interceptors and timeout protection.

### 2. Service & Routing Layer (`backend/`)
- Flask Blueprint (`api_bp`) maps RESTful endpoints without cluttering application initialization.
- **PredictionService** encapsulates model loading, feature validation, transformation, inference, and HR recommendation generation.
- **AnalyticsService** decouples data loading and statistical aggregation from HTTP request parsing, transforming raw CSV records into optimized JSON payloads for Recharts.

### 3. Machine Learning & Persistence Layer (`ml_model/`, `dataset/`)
- Strictly enforces ML featurization ordering by separating training and validation sets before applying any scaling or encoding transformations.
- Serializes `model.pkl`, `scaler.pkl`, and `encoder.pkl` via Joblib to ensure sub-millisecond inference latency without retraining on every API call.
