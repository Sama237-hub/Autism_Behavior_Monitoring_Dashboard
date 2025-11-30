import pandas as pd
from fastapi import HTTPException, UploadFile


def read_csv_upload(file: UploadFile) -> pd.DataFrame:
    try:
        # file.file is a SpooledTemporaryFile / file-like object
        df = pd.read_csv(file.file)
        return df
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read CSV: {e}")
