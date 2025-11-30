from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class PredictRequest(BaseModel):
    data: List[Dict[str, Any]]


class PredictResponseItem(BaseModel):
    patient_id: str
    diagnosis: Optional[str] = None
    diagnosis_probability: Optional[float] = None
    severity: Optional[str] = None
    severity_scores: Optional[Dict[str, float]] = None


class PredictResponse(BaseModel):
    predictions: List[PredictResponseItem]
