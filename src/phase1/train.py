import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_validate
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib
import os
import yaml

def load_config():
    """Load configuration from YAML file"""
    config_path = os.path.join(os.path.dirname(__file__), '../../config/phase1_config.yaml')
    with open(config_path, 'r') as file:
        config = yaml.safe_load(file)
    return config

def train_models(X, y):
    """
    Train 5 different models with same settings as report
    """
    config = load_config()
    
    # Define models with parameters from config
    models = {
        'Random Forest': RandomForestClassifier(
            n_estimators=config['models']['RandomForest']['n_estimators'],
            random_state=config['models']['RandomForest']['random_state']
        ),
        'Decision Tree': DecisionTreeClassifier(
            random_state=config['models']['DecisionTree']['random_state']
        ),
        'Support Vector Machine (RBF)': SVC(
            kernel=config['models']['SVM_RBF']['kernel'],
            random_state=config['models']['SVM_RBF']['random_state']
        ),
        'Logistic Regression': LogisticRegression(
            random_state=config['models']['LogisticRegression']['random_state']
        ),
        'Support Vector Machine (Linear)': SVC(
            kernel=config['models']['SVM_Linear']['kernel'],
            random_state=config['models']['SVM_Linear']['random_state']
        )
    }
    
    # Evaluate models using 5-fold cross-validation
    results = {}
    
    for name, model in models.items():
        print(f"Training: {name}")
        
        # Use StandardScaler for scale-sensitive models
        if 'SVM' in name or 'Logistic' in name:
            pipeline = Pipeline([
                ('scaler', StandardScaler()),
                ('model', model)
            ])
        else:
            pipeline = model
        
        # Cross-validation with same settings as report
        scoring = config['evaluation']['metrics']
        cv_folds = config['model_training']['cv_folds']
        random_state = config['model_training']['random_state']
        
        scores = cross_validate(pipeline, X, y, cv=cv_folds, scoring=scoring, n_jobs=-1)
        
        # Calculate averages
        results[name] = {
            'Accuracy': np.mean(scores['test_accuracy']),
            'Precision': np.mean(scores['test_precision']), 
            'Recall': np.mean(scores['test_recall']),
            'F1-Score': np.mean(scores['test_f1']),
            'ROC-AUC': np.mean(scores['test_roc_auc'])
        }
        
        print(f"  {name} - F1: {results[name]['F1-Score']:.4f}")
    
    return results, models

def save_best_model(model, model_name):
    """Save the best model to file"""
    models_dir = os.path.join(os.path.dirname(__file__), '../../models/phase1')
    os.makedirs(models_dir, exist_ok=True)
    
    # Create filename from model name
    filename = model_name.lower().replace(' ', '_').replace('(', '').replace(')', '') + '.pkl'
    file_path = os.path.join(models_dir, filename)
    
    joblib.dump(model, file_path)
    print(f"Model saved to: {file_path}")
    
    return file_path

def get_feature_correlations(df, target_column='ASD_traits'):
    """Calculate feature correlations with target"""
    # Select only numeric columns for correlation
    numeric_df = df.select_dtypes(include=[np.number])
    
    # Check if target column is in numeric columns
    if target_column not in numeric_df.columns:
        raise ValueError(f"Target column '{target_column}' is not numeric or not found")
    
    correlations = numeric_df.corr()[target_column].abs().sort_values(ascending=False)
    return correlations