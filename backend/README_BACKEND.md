AutismAI Backend - Run Instructions

1) Place your model artifacts into:
   backend/models/
   Required files (at least one diagnosis and one severity model):
     - randomforest_diagnosis_model.pkl  (or diagnosis_model.pkl)
     - gradientboosting_severity_model.pkl (or severity_model.pkl)
   Optional helpers:
     - scaler.pkl
     - severity_scaler.pkl
     - label_encoders.pkl
     - feature_info.json

   feature_info.json should contain either:
     - "feature_columns": [ ... ]
     or
     - "diagnosis_columns": [ ... ], "severity_columns": [ ... ]

2) Create a Python environment and install dependencies:
   python -m venv venv
   source venv/bin/activate   # on Linux / macOS
   venv\\Scripts\\activate    # on Windows
   pip install -r backend/requirements.txt

3) Start the server:
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

4) Test endpoints:
   Health: GET http://localhost:8000/health
   Diagnosis (file upload):
     POST http://localhost:8000/api/predict/diagnosis
     Form-data: key=file, select a CSV file.
   Severity:
     POST http://localhost:8000/api/predict/severity
   Batch:
     POST http://localhost:8000/api/predict/batch

Notes:
- The API expects CSV files with columns matching the feature list in feature_info.json.
- For local frontend development, point your frontend dev server to `http://localhost:8000/api`.
