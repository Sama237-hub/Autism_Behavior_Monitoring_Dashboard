import os
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from typing import Any, Dict

from app.utils import read_csv_upload
from app.models_loader import artifacts
from app.preprocess import prepare_features

router = APIRouter()


@router.post("/predict/diagnosis")
async def predict_diagnosis(file: UploadFile = File(...)):
    """
    Accepts a CSV file. Returns diagnosis predictions with probabilities.
    Expected CSV must contain 'patient_id' (optional) and the feature columns described in feature_info.json.
    """
    df = read_csv_upload(file)
    model = artifacts.get("diagnosis_model")
    if model is None:
        raise HTTPException(status_code=500, detail="Diagnosis model not loaded on server")

    # prepare features
    X = prepare_features(df, for_model="diagnosis")

    # model predict_proba
    try:
        probs = model.predict_proba(X)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diagnosis model predict error: {e}")

    # if binary, take second column as ASD probability; otherwise adapt
    if probs.ndim == 1:
        # model returned single-dim scores (rare); treat as probability for positive class
        probs = probs.reshape(-1, 1)

    # Determine label mapping if model has classes_
    classes = getattr(model, "classes_", None)
    # default: assume classes_ = [0,1] with 1 -> ASD
    response = []
    for idx, row in df.iterrows():
        pid = str(row.get("patient_id", idx))
        # if binary, pick column index for positive class
        if classes is not None and len(classes) == probs.shape[1]:
            # find index of positive class: try label 'ASD' or 1, otherwise choose last column
            try:
                pos_index = list(classes).index(1)
            except Exception:
                try:
                    pos_index = list(classes).index("ASD")
                except Exception:
                    pos_index = probs.shape[1] - 1
        else:
            pos_index = probs.shape[1] - 1

        prob = float(probs[idx, pos_index])
        pred_label = "ASD" if prob >= 0.5 else "Not ASD"
        response.append(
            {
                "patient_id": pid,
                "diagnosis": pred_label,
                "diagnosis_probability": prob,
            }
        )

    return JSONResponse({"predictions": response})


@router.post("/predict/severity")
async def predict_severity(file: UploadFile = File(...)):
    """
    Accepts a CSV file. Returns severity class and probability vector.
    Severity model should implement predict_proba and have classes_ attribute.
    """
    df = read_csv_upload(file)
    model = artifacts.get("severity_model")
    if model is None:
        raise HTTPException(status_code=500, detail="Severity model not loaded on server")

    X = prepare_features(df, for_model="severity")

    try:
        probs = model.predict_proba(X)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Severity model predict error: {e}")

    classes = getattr(model, "classes_", None)
    response = []
    for idx, row in df.iterrows():
        pid = str(row.get("patient_id", idx))
        if classes is None:
            # If classes_ not present, fallback to index-based labels
            scores = {str(i): float(probs[idx, i]) for i in range(probs.shape[1])}
            pred_idx = int(probs[idx].argmax())
            pred_label = str(pred_idx)
        else:
            scores = {str(c): float(probs[idx, i]) for i, c in enumerate(classes)}
            pred_label = str(classes[int(probs[idx].argmax())])
        response.append({"patient_id": pid, "severity": pred_label, "severity_scores": scores})

    return JSONResponse({"predictions": response})


@router.post("/predict/batch")
async def predict_batch(file: UploadFile = File(...)):
    """
    Combined endpoint to run both diagnosis and severity on the same CSV.
    Returns a list of objects: patient_id, diagnosis, diagnosis_probability, severity, severity_scores.
    """
    df = read_csv_upload(file)
    result = []

    diag_model = artifacts.get("diagnosis_model")
    sev_model = artifacts.get("severity_model")

    X_diag = None
    X_sev = None
    dprobs = None
    sprobs = None

    if diag_model:
        X_diag = prepare_features(df, for_model="diagnosis")
        try:
            dprobs = diag_model.predict_proba(X_diag)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Diagnosis prediction error: {e}")

    if sev_model:
        X_sev = prepare_features(df, for_model="severity")
        try:
            sprobs = sev_model.predict_proba(X_sev)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Severity prediction error: {e}")

    d_classes = getattr(diag_model, "classes_", None) if diag_model else None
    s_classes = getattr(sev_model, "classes_", None) if sev_model else None

    for idx, row in df.iterrows():
        pid = str(row.get("patient_id", idx))
        item = {"patient_id": pid}

        if dprobs is not None:
            # pick positive probability as previously implemented
            if d_classes is not None:
                try:
                    pos_idx = list(d_classes).index(1)
                except Exception:
                    try:
                        pos_idx = list(d_classes).index("ASD")
                    except Exception:
                        pos_idx = dprobs.shape[1] - 1
            else:
                pos_idx = dprobs.shape[1] - 1
            prob = float(dprobs[idx, pos_idx])
            item["diagnosis_probability"] = prob
            item["diagnosis"] = "ASD" if prob >= 0.5 else "Not ASD"

        if sprobs is not None:
            if s_classes is None:
                scores = {str(i): float(sprobs[idx, i]) for i in range(sprobs.shape[1])}
                pred = str(int(sprobs[idx].argmax()))
            else:
                scores = {str(c): float(sprobs[idx, i]) for i, c in enumerate(s_classes)}
                pred = str(s_classes[int(sprobs[idx].argmax())])
            item["severity_scores"] = scores
            item["severity"] = pred

        result.append(item)

    return JSONResponse({"predictions": result})


@router.get("/metrics/diagnosis")
async def get_diagnosis_metrics():
    """
    If a file 'diagnosis_metrics.json' exists under backend/models,
    return its contents. Otherwise return an empty dict.
    """
    p = os.path.join(os.path.dirname(__file__), "..", "..", "models", "diagnosis_metrics.json")
    if os.path.exists(p):
        import json
        with open(p, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


@router.get("/metrics/severity")
async def get_severity_metrics():
    """
    If a CSV file 'models_severity_accuracy_summary.csv' exists under backend/models,
    return it as a list of records.
    """
    p = os.path.join(os.path.dirname(__file__), "..", "..", "models", "models_severity_accuracy_summary.csv")
    if os.path.exists(p):
        import pandas as pd
        df = pd.read_csv(p)
        return df.to_dict(orient="records")
    return {}
