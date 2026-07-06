# Employee Attrition Prediction System 🚀

A production-ready Full Stack AI Application designed to help HR departments predict employee turnover, analyze attrition trends, and generate actionable retention strategies using modern Machine Learning and web technologies.

---

## 📋 Project Overview

Employee turnover is a critical challenge for organizations worldwide. High attrition leads to productivity loss, hiring costs, and team instability. The **Employee Attrition Prediction System** leverages advanced machine learning algorithms trained on the IBM HR Analytics dataset to assess employee risk levels in real-time. 

With an intuitive HR Dashboard, comprehensive analytics charts, and intelligent retention recommendations, HR managers can proactively identify high-risk employees and intervene before they leave.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js (v18)** – Component-based modern UI library
- **Vite** – Ultra-fast development server and production bundler
- **Tailwind CSS (v3)** – Utility-first CSS framework for a responsive Blue & White HR theme
- **React Router (v6)** – Client-side routing and protected navigation
- **Axios** – HTTP client for REST API communication
- **Recharts** – Interactive, responsive data visualization charts
- **React Hook Form** – Robust form validation and state management
- **Lucide React** – Clean, professional HR dashboard icons

### **Backend**
- **Python Flask** – Lightweight, robust web microframework
- **Flask REST API** – JSON API endpoints for prediction and analytics
- **Flask-CORS** – Cross-Origin Resource Sharing enablement

### **Machine Learning**
- **Scikit-learn** – Core ML training, preprocessing, and model evaluation
- **XGBoost** – Gradient boosted decision trees for state-of-the-art accuracy
- **Pandas & NumPy** – Data manipulation, feature engineering, and statistical analysis
- **Joblib** – Model and preprocessor artifact serialization (`model.pkl`, `scaler.pkl`, `encoder.pkl`)
- **Matplotlib & Seaborn** – Exploratory Data Analysis (EDA) and evaluation visualizations

---

## 🚀 Installation & Setup

### **Prerequisites**
- **Node.js** (v18 or higher) and `npm`
- **Python** (v3.9 or higher) and `pip`

### **1. Clone the Repository**
```bash
git clone https://github.com/your-repo/Employee-Attrition-Prediction.git
cd Employee-Attrition-Prediction
```

### **2. Setup Backend & ML Environment**
Create and activate a Python virtual environment (optional but recommended):
```bash
# On Windows
python -m venv venv
.\venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

### **3. Train the Machine Learning Models**
Before starting the API server, train the models to generate serialized artifacts:
```bash
python ml_model/train_model.py
```
> *This script will perform data cleaning, encoding, scaling, train 4 algorithms (Logistic Regression, Decision Tree, Random Forest, XGBoost), compare accuracy, and automatically save the best model to `ml_model/model.pkl`.*

### **4. Start the Flask Backend Server**
Start the REST API server:
```bash
python backend/app.py
```
> *The backend server will run on `http://localhost:5000`.*

### **5. Setup & Start Frontend Application**
Open a new terminal window, navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
> *The web application will be accessible at `http://localhost:5173`.*

---

## 📂 Folder Structure

```
Employee-Attrition-Prediction/
│
├── frontend/               # React + Vite frontend web application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Sidebar, StatCard, ChartCard)
│   │   ├── pages/          # Application views (Login, Dashboard, PredictionForm, Result, Analytics)
│   │   ├── services/       # Axios API integration client
│   │   └── context/        # Authentication & global state management
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                # Flask REST API server
│   ├── routes/             # API routing definitions
│   ├── services/           # Prediction inference & analytics aggregation logic
│   ├── app.py              # Main Flask server entry point
│   └── requirements.txt
│
├── ml_model/               # Machine learning training & evaluation pipeline
│   ├── train_model.py      # Automated training, evaluation & selection script
│   ├── model.pkl           # Saved best performing ML model artifact
│   ├── scaler.pkl          # Saved StandardScaler artifact
│   ├── encoder.pkl         # Saved categorical encoders artifact
│   └── model_metadata.json # Model performance metrics & feature names
│
├── dataset/                # Data storage & loading utilities
│   ├── WA_Fn-UseC_-HR-Employee-Attrition.csv # IBM HR Analytics dataset (1,470 rows)
│   └── dataset_loader.py   # Dataset verification & loading script
│
├── docs/                   # System documentation & architectural notes
│   ├── architecture.md     # Architectural design & data flow diagram
│   └── model_evaluation.md # Detailed algorithmic comparison & confusion matrices
│
├── screenshots/            # UI demo screenshots & visual walkthroughs
│   └── README.md
│
├── README.md               # Project overview & documentation
├── requirements.txt        # Root Python dependency specifications
└── .gitignore              # Version control ignore rules
```

---

## 📡 API Documentation

Base URL: `http://localhost:5000`

### **1. Health Check**
- **Endpoint:** `GET /health`
- **Description:** Verifies backend API operational status and model readiness.
- **Response:**
  ```json
  {
    "status": "healthy",
    "model_loaded": true,
    "timestamp": "2026-07-06T10:00:00Z"
  }
  ```

### **2. Get Dashboard KPIs**
- **Endpoint:** `GET /dashboard`
- **Description:** Returns aggregate employee statistics for the HR dashboard.
- **Response:**
  ```json
  {
    "total_employees": 1470,
    "high_risk_employees": 237,
    "average_satisfaction": 2.73,
    "average_monthly_income": 6502.93,
    "attrition_rate": 16.12
  }
  ```

### **3. Get Analytics Distributions**
- **Endpoint:** `GET /analytics`
- **Description:** Retrieves multi-dimensional aggregated data formatted for Recharts visualizations.
- **Response:**
  ```json
  {
    "department_attrition": [
      { "name": "Sales", "Total": 446, "Left": 92, "Rate": 20.63 },
      { "name": "Research & Development", "Total": 961, "Left": 133, "Rate": 13.84 },
      { "name": "Human Resources", "Total": 63, "Left": 12, "Rate": 19.05 }
    ],
    "gender_attrition": [
      { "name": "Male", "value": 150 },
      { "name": "Female", "value": 87 }
    ],
    "age_distribution": [
      { "age_group": "18-25", "count": 123, "attrition_rate": 35.8 },
      { "age_group": "26-35", "count": 606, "attrition_rate": 19.3 }
    ]
    ...
  }
  ```

### **4. Predict Employee Attrition**
- **Endpoint:** `POST /predict`
- **Description:** Predicts employee turnover probability and provides tailored retention suggestions.
- **Request Body (JSON):**
  ```json
  {
    "Age": 31,
    "Gender": "Male",
    "Department": "Sales",
    "JobRole": "Sales Executive",
    "MonthlyIncome": 5400,
    "YearsAtCompany": 3,
    "DistanceFromHome": 15,
    "Overtime": "Yes",
    "JobSatisfaction": 2,
    "WorkLifeBalance": 2,
    "BusinessTravel": "Travel_Frequently",
    "Education": 3,
    "EnvironmentSatisfaction": 1,
    "RelationshipSatisfaction": 3
  }
  ```
- **Response:**
  ```json
  {
    "prediction": "Leave",
    "probability": 78.4,
    "risk_level": "High",
    "retention_suggestion": "High risk identified due to Overtime and low Environment Satisfaction. Recommend reviewing workload distribution, offering flexible working hours, and conducting a 1-on-1 career development check-in.",
    "confidence_score": 0.88
  }
  ```

---

## 📸 Screenshots Section

| Dashboard Overview | Employee Prediction Form |
| :---: | :---: |
| *(See `screenshots/` folder)* | *(See `screenshots/` folder)* |

| Prediction Result & AI Advice | Analytics Chart Suite |
| :---: | :---: |
| *(See `screenshots/` folder)* | *(See `screenshots/` folder)* |

---

## 👥 Contributors

- **Senior Full Stack AI Engineering Team** – Architecture, Full Stack Development, ML Pipeline Design, and UI/UX Implementation.

---

*Built with passion for data-driven Human Resources and employee retention.*
