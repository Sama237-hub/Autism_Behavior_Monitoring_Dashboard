import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import yaml
import os

def load_config():
    """Load configuration from YAML file"""
    current_dir = os.path.dirname(__file__)
    config_path = os.path.join(current_dir, '../../config/phase1_config.yaml')
    with open(config_path, 'r') as file:
        config = yaml.safe_load(file)
    return config

def load_and_preprocess_data(file_path):
    """
    Load data and apply the same filtering steps from the report
    """
    config = load_config()
    
    # Check if file exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Data file not found: {file_path}")
    
    print(f"Loading data from: {file_path}")
    
    # Load data
    df = pd.read_csv(file_path)
    print(f"Original data shape: {df.shape}")
    print(f"Columns in raw data: {list(df.columns)}")
    
    # Remove columns specified in config
    columns_to_drop = config['preprocessing']['columns_to_drop']
    
    # Only drop columns that actually exist in the dataframe
    existing_columns_to_drop = [col for col in columns_to_drop if col in df.columns]
    print(f"Dropping columns: {existing_columns_to_drop}")
    
    df_filtered = df.drop(columns=existing_columns_to_drop, errors='ignore')
    print(f"Data shape after filtering: {df_filtered.shape}")
    
    return df_filtered

def engineer_features(df):
    """
    Process data and add A_Score_Sum feature
    """
    config = load_config()
    
    print("Original columns before encoding:")
    print(df.columns.tolist())
    
    # Ensure target column is numeric
    target_column = config['preprocessing']['target_column']
    if target_column in df.columns:
        df[target_column] = pd.to_numeric(df[target_column], errors='coerce')
        # Drop rows where target is NaN after conversion
        df = df.dropna(subset=[target_column])
        print(f"Target column '{target_column}' converted to numeric")
    
    # One-Hot Encoding for categorical features
    categorical_cols = config['preprocessing']['categorical_columns']
    
    # Only encode columns that exist and are categorical
    existing_categorical_cols = [col for col in categorical_cols if col in df.columns]
    print(f"Encoding categorical columns: {existing_categorical_cols}")
    
    # Convert categorical columns to string type to avoid encoding issues
    for col in existing_categorical_cols:
        df[col] = df[col].astype(str)
    
    df_encoded = pd.get_dummies(df, columns=existing_categorical_cols, drop_first=True)
    
    # Identify A1-A10 columns (core questions) and ensure they're numeric
    a_columns = []
    for col in df_encoded.columns:
        if col.startswith('A') and col not in ['A_Score_Sum', 'ASD_traits']:
            # Ensure A-columns are numeric
            df_encoded[col] = pd.to_numeric(df_encoded[col], errors='coerce')
            a_columns.append(col)
    
    print(f"Found {len(a_columns)} A-columns: {a_columns}")
    
    # Create A_Score_Sum (sum of A1-A10 responses)
    if a_columns:
        df_encoded['A_Score_Sum'] = df_encoded[a_columns].sum(axis=1)
    else:
        print("Warning: No A-columns found for A_Score_Sum calculation")
        df_encoded['A_Score_Sum'] = 0
    
    # Fill any NaN values with 0 for numeric columns
    numeric_columns = df_encoded.select_dtypes(include=[np.number]).columns
    df_encoded[numeric_columns] = df_encoded[numeric_columns].fillna(0)
    
    # For object columns, fill with 'Unknown'
    object_columns = df_encoded.select_dtypes(include=['object']).columns
    df_encoded[object_columns] = df_encoded[object_columns].fillna('Unknown')
    
    print(f"Data shape after feature engineering: {df_encoded.shape}")
    
    return df_encoded

def prepare_features_target(df):
    """
    Separate features and target variable and ensure all features are numeric
    """
    config = load_config()
    target_column = config['preprocessing']['target_column']
    
    # Check if target column exists
    if target_column not in df.columns:
        available_columns = df.columns.tolist()
        raise KeyError(f"Target column '{target_column}' not found. Available columns: {available_columns}")
    
    # Ensure target is numeric
    df[target_column] = pd.to_numeric(df[target_column], errors='coerce')
    
    # Drop rows where target is NaN
    df = df.dropna(subset=[target_column])
    
    # Separate features and target
    X = df.drop(target_column, axis=1)
    y = df[target_column]
    
    # Convert all features to numeric
    X = convert_features_to_numeric(X)
    
    print(f"Features shape: {X.shape}")
    print(f"Target distribution:\n{y.value_counts()}")
    print(f"ASD percentage: {y.mean():.3f}")
    
    return X, y

def convert_features_to_numeric(X):
    """
    Convert all features to numeric types
    """
    X_processed = X.copy()
    
    # Handle object/string columns
    object_columns = X_processed.select_dtypes(include=['object']).columns
    
    for col in object_columns:
        print(f"Converting column '{col}' to numeric...")
        
        # Try direct numeric conversion first
        X_processed[col] = pd.to_numeric(X_processed[col], errors='ignore')
        
        # If still object, use label encoding
        if X_processed[col].dtype == 'object':
            unique_vals = X_processed[col].unique()
            print(f"  Label encoding '{col}': {len(unique_vals)} unique values - {list(unique_vals)}")
            X_processed[col] = X_processed[col].astype('category').cat.codes
    
    # Convert all remaining columns to numeric
    for col in X_processed.columns:
        if X_processed[col].dtype not in [np.number, 'int', 'float']:
            X_processed[col] = pd.to_numeric(X_processed[col], errors='coerce')
    
    # Fill any remaining NaN values with 0
    X_processed = X_processed.fillna(0)
    
    print(f"After conversion - Features shape: {X_processed.shape}")
    print(f"Data types after conversion: {X_processed.dtypes.value_counts()}")
    
    return X_processed

def get_numeric_dataframe(df, target_column='ASD_traits'):
    """
    Create a numeric-only version of dataframe for correlation analysis
    """
    # Create copy
    df_numeric = df.copy()
    
    # Convert target to numeric if it exists
    if target_column in df_numeric.columns:
        df_numeric[target_column] = pd.to_numeric(df_numeric[target_column], errors='coerce')
    
    # Convert all columns to numeric where possible
    for col in df_numeric.columns:
        if col != target_column:
            df_numeric[col] = pd.to_numeric(df_numeric[col], errors='coerce')
    
    # Drop columns that are all NaN after conversion
    df_numeric = df_numeric.dropna(axis=1, how='all')
    
    # Fill remaining NaN values with 0
    df_numeric = df_numeric.fillna(0)
    
    print(f"Numeric dataframe shape: {df_numeric.shape}")
    print(f"Numeric columns: {len(df_numeric.select_dtypes(include=[np.number]).columns)}")
    
    return df_numeric

def save_processed_data(df, file_path):
    """Save processed data to CSV"""
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    df.to_csv(file_path, index=False)
    print(f"Processed data saved to: {file_path}")

def data_summary(df):
    """
    Print comprehensive data summary
    """
    print("=" * 50)
    print("DATA SUMMARY")
    print("=" * 50)
    print(f"Shape: {df.shape}")
    print(f"Memory usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
    
    print("\nDATA TYPES:")
    print(df.dtypes.value_counts())
    
    print("\nMISSING VALUES:")
    missing = df.isnull().sum()
    missing_pct = (missing / len(df)) * 100
    missing_df = pd.DataFrame({'Missing Count': missing, 'Missing %': missing_pct})
    print(missing_df[missing_df['Missing Count'] > 0])
    
    print("\nNUMERIC COLUMNS SUMMARY:")
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    if len(numeric_cols) > 0:
        print(f"Found {len(numeric_cols)} numeric columns")
        print(df[numeric_cols].describe())
    else:
        print("No numeric columns found")
    
    print("\nCATEGORICAL COLUMNS SUMMARY:")
    categorical_cols = df.select_dtypes(include=['object']).columns
    if len(categorical_cols) > 0:
        print(f"Found {len(categorical_cols)} categorical columns")
        for col in categorical_cols:
            print(f"  {col}: {df[col].nunique()} unique values")
    else:
        print("No categorical columns found")