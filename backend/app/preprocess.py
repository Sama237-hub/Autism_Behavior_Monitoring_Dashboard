from typing import List
import pandas as pd
import os

from app.models_loader import artifacts

# Helper to prepare features for a model (diagnosis / severity).
# The function enforces column ordering and applies scalers/encoders if available.


def _get_feature_columns(model_name: str) -> List[str]:
    """
    Read feature lists from feature_info. Support different keys:
    - 'diagnosis_columns' and 'severity_columns'
    - fallback to 'feature_columns' or a top-level list
    """
    feature_info = artifacts.get("feature_info")
    if not feature_info:
        raise ValueError("feature_info not found in models folder")

    if model_name == "diagnosis":
        cols = feature_info.get("diagnosis_columns")
    elif model_name == "severity":
        cols = feature_info.get("severity_columns")
    else:
        cols = None

    if cols is None:
        # try general keys
        cols = feature_info.get("feature_columns") or feature_info.get("columns") or feature_info.get("features")

    if not isinstance(cols, list):
        raise ValueError("feature_info does not contain valid columns list")

    return cols


def prepare_features(df: pd.DataFrame, for_model: str = "diagnosis") -> pd.DataFrame:
    """
    Validate input DataFrame has required columns, reorder columns,
    and apply scalers if present.

    Returns a new DataFrame ready for model.predict / predict_proba.
    """
    if not isinstance(df, pd.DataFrame):
        raise ValueError("Input must be a pandas DataFrame")

    cols = _get_feature_columns(for_model)
    missing = [c for c in cols if c not in df.columns]
    if missing:
        raise ValueError(f"Missing input columns: {missing}")

    X = df[cols].copy()

    # apply scaler if present
    if for_model == "diagnosis":
        scaler = artifacts.get("scaler")
    else:
        scaler = artifacts.get("severity_scaler")

    if scaler is not None:
        try:
            scaled = scaler.transform(X)
            X = pd.DataFrame(scaled, columns=cols, index=df.index)
        except Exception as e:
            raise ValueError(f"Error applying scaler: {e}")

    # If label encoders exist and we need to encode categorical features,
    # you can implement that here. For now, we assume training pipeline stored
    # numeric-ready columns in feature_info.
    return X
