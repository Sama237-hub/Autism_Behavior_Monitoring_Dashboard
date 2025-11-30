def test_environment():
    """Test if all required packages are installed"""
    try:
        import pandas as pd
        import numpy as np
        from sklearn.ensemble import RandomForestClassifier
        import matplotlib.pyplot as plt
        import seaborn as sns
        import joblib
        import yaml
        
        print(" All core packages imported successfully!")
        print(f"pandas version: {pd.__version__}")
        print(f"scikit-learn available: True")
        
        return True
        
    except ImportError as e:
        print(f" Missing package: {e}")
        return False

if __name__ == "__main__":
    test_environment()