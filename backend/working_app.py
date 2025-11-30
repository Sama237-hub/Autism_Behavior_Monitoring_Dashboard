from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from typing import List, Dict
import joblib
import os

app = FastAPI(
    title="Autism Diagnosis API",
    description="Dual Model System: Diagnosis + Severity Assessment",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000", "http://localhost:3003"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(" Autism Diagnosis API Starting...")
print(" Joblib Version:", joblib.__version__)

@app.get("/")
async def root():
    return {"message": "Autism Diagnosis API with Dual Models is running!"}

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy", 
        "message": "Dual Model API is working!",
        "models": ["SVM Diagnosis", "GradientBoosting Severity"]
    }

@app.get("/api/model-performance")
async def get_model_performance():
    """Get performance metrics for BOTH models"""
    try:
        # REPLACE THESE WITH YOUR ACTUAL MODEL METRICS
        return {
            "diagnosis_model": {
                "accuracy": 95.97,    # Your actual diagnosis model accuracy
                "precision": 93.83,   # Your actual precision
                "recall": 99.07,      # Your actual recall
                "f1_score": 96.38,    # Your actual F1 score
                "model_name": "Random Forest Diagnosis Model"
            },
            "severity_model": {
                "accuracy": 97.73,    # Your actual severity model accuracy
                "precision": 93.83,   # Your actual precision
                "recall": 98,      # Your actual recall
                "f1_score": 98,    # Your actual F1 score
                "model_name": "GradientBoosting Severity Model"
            },
            "dataset_info": {
                "total_patients": 250,
                "training_size": 200,
                "test_size": 50
            }
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/recent-predictions")
async def get_recent_predictions():
    """Get recent predictions from BOTH models"""
    try:
        # REPLACE WITH YOUR ACTUAL PREDICTION DATA
        return [
            {
                "patient_id": "PT-001",
                "diagnosis_confidence": 92,
                "diagnosis_result": "Autism",
                "severity_level": "Moderate",
                "severity_confidence": 88,
                "age": 8,
                "gender": "Male",
                "timestamp": "2024-01-15"
            },
            {
                "patient_id": "PT-002", 
                "diagnosis_confidence": 78,
                "diagnosis_result": "Autism", 
                "severity_level": "Mild",
                "severity_confidence": 82,
                "age": 6,
                "gender": "Female",
                "timestamp": "2024-01-15"
            },
            {
                "patient_id": "PT-003",
                "diagnosis_confidence": 95,
                "diagnosis_result": "Autism",
                "severity_level": "Severe", 
                "severity_confidence": 91,
                "age": 10,
                "gender": "Male",
                "timestamp": "2024-01-14"
            }
        ]
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    """Process CSV file for analysis"""
    try:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        
        # Read the CSV file
        df = pd.read_csv(file.file)
        
        return {
            "success": True,
            "message": f"Successfully processed {len(df)} records",
            "data": {
                "total_records": len(df),
                "columns": list(df.columns),
                "preview": df.head().to_dict('records')
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/check-models")
async def check_models():
    """Check available model files"""
    try:
        model_files = []
        models_path = "models"
        
        if os.path.exists(models_path):
            model_files = [f for f in os.listdir(models_path) if f.endswith('.pkl')]
        
        return {
            "models_folder_exists": os.path.exists(models_path),
            "available_models": model_files,
            "total_models": len(model_files)
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("working_app:app", host="0.0.0.0", port=5000, reload=True)