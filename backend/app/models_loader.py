import os
import joblib
import json
from typing import Dict, Any, Optional

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/app -> backend
MODELS_DIR = os.path.join(BASE_DIR, "models")


def safe_load(path: str):
    try:
        return joblib.load(path)
    except Exception as e:
        # try with pickle as fallback
        import pickle
        with open(path, "rb") as f:
            return pickle.load(f)


class ModelArtifacts:
    """
    Load model artifacts from backend/models/ and keep them accessible.
    The loader checks for common file names and loads whatever exists.
    """

    DIAG_CANDIDATES = [
        "randomforest_diagnosis_model.pkl",
        "rf_diagnosis_model.pkl",
        "diagnosis_model.pkl",
        "svm_diagnosis_model.pkl",
        "model1_diagnosis.pkl",
    ]

    SEV_CANDIDATES = [
        "gradientboosting_severity_model.pkl",
        "severity_model.pkl",
        "model2_severity.pkl",
    ]

    SCALER_CANDIDATES = [
        "scaler.pkl",
        "svm_scaler.pkl",
        "diagnosis_scaler.pkl",
    ]

    SEV_SCALER_CANDIDATES = [
        "severity_scaler.pkl",
        "sev_scaler.pkl",
    ]

    ENCODER_CANDIDATES = [
        "label_encoders.pkl",
        "encoders.pkl",
    ]

    FEATURE_INFO_FILES = [
        "feature_info.json",
        "feature_cols.json",
        "features.json",
    ]

    def __init__(self, models_dir: Optional[str] = None):
        self.models_dir = os.path.abspath(models_dir or MODELS_DIR)
        self._artifacts: Dict[str, Any] = {}
        self._load_all()

    def _find_existing(self, candidates):
        for name in candidates:
            path = os.path.join(self.models_dir, name)
            if os.path.exists(path):
                return path
        return None

    def _load_json(self, path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return None

    def _load_all(self):
        # Diagnosis model
        diag_path = self._find_existing(self.DIAG_CANDIDATES)
        if diag_path:
            try:
                self._artifacts["diagnosis_model"] = safe_load(diag_path)
                self._artifacts["diagnosis_model_path"] = diag_path
            except Exception as e:
                print(f"Failed to load diagnosis model {diag_path}: {e}")

        # Severity model
        sev_path = self._find_existing(self.SEV_CANDIDATES)
        if sev_path:
            try:
                self._artifacts["severity_model"] = safe_load(sev_path)
                self._artifacts["severity_model_path"] = sev_path
            except Exception as e:
                print(f"Failed to load severity model {sev_path}: {e}")

        # scalers / encoders
        scaler_path = self._find_existing(self.SCALER_CANDIDATES)
        if scaler_path:
            try:
                self._artifacts["scaler"] = safe_load(scaler_path)
                self._artifacts["scaler_path"] = scaler_path
            except Exception as e:
                print(f"Failed to load scaler {scaler_path}: {e}")

        sev_scaler_path = self._find_existing(self.SEV_SCALER_CANDIDATES)
        if sev_scaler_path:
            try:
                self._artifacts["severity_scaler"] = safe_load(sev_scaler_path)
                self._artifacts["severity_scaler_path"] = sev_scaler_path
            except Exception as e:
                print(f"Failed to load severity scaler {sev_scaler_path}: {e}")

        enc_path = self._find_existing(self.ENCODER_CANDIDATES)
        if enc_path:
            try:
                self._artifacts["label_encoders"] = safe_load(enc_path)
                self._artifacts["label_encoders_path"] = enc_path
            except Exception as e:
                print(f"Failed to load encoders {enc_path}: {e}")

        # feature info
        fpath = self._find_existing(self.FEATURE_INFO_FILES)
        if fpath:
            fi = self._load_json(fpath)
            if fi:
                self._artifacts["feature_info"] = fi
                self._artifacts["feature_info_path"] = fpath

    def get(self, key: str):
        return self._artifacts.get(key)

    def list_artifacts(self):
        return list(self._artifacts.keys())


# instantiate module-level artifacts for reuse
artifacts = ModelArtifacts()
