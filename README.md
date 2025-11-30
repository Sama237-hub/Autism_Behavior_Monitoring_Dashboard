#  Autism Screening & Severity Prediction System  
### **FastAPI • Machine Learning • Early Detection for Toddlers**

This project delivers a complete machine-learning pipeline for **early autism screening in toddlers**, followed by **severity prediction**.  
It includes clean data preprocessing, multi-model training, evaluation, and a fully functional **FastAPI backend** ready for deployment.

---

##  Overview

The system predicts two levels:

1. **ASD Traits Classification**  
   - Output: *Autistic* or *Non-Autistic*

2. **Severity Prediction**  
   - Output: *Mild* • *Moderate* • *Severe*

The pipeline is optimized for early screening using behavioral and demographic indicators only — avoiding any diagnostic-heavy data to ensure realistic, practical use.

---

## 📊 Dataset Summary

- **Total Rows:** 1,985 toddlers  
- **Final Features:** 28  
- **Target Variable:** `ASD_traits`  
- **Distribution:**  
  - ASD: **1,074**  
  - Non-ASD: **911**

### **Features Used**

#### 🧩 Behavioral A-Items:
- looks_when_called  
- eye_contact  
- point_wants  
- point_interest  
- pretend_play  
- follow_gaze  
- comfort_others  
- unusual_words  
- simple_gestures  
- stares_blankly  

#### 👶 Demographics:
- Age_Years  
- Sex  
- Ethnicity  
- Jaundice  
- Family_mem_with_ASD  
- Who_completed_the_test  

###  Removed Columns (to prevent leakage)
- QChat-10 Score  
- CARS Score  
- SRS  
- Speech Delay / Learning Disorders  
- Anxiety / Behavioral Disorders  
- Genetic / Developmental Disorders  
*(All diagnostic indicators removed intentionally)*

---

##  Machine Learning Pipeline

### **1. Data Cleaning & Preprocessing**
- Removed diagnostic columns  
- Encoded categorical variables  
- Balanced preprocessing for both models  
- Ensured no leakage between feature sets and target labels  

### **2. Models Trained**
Several models were trained and compared:
- Logistic Regression  
- Random Forest  
- XGBoost  
- SVM  
- KNN  

**Cross-validation** was applied for reliable evaluation.

### **3. Two-Stage Prediction Architecture**
- **Model 1:** Binary classifier → ASD / Non-ASD  
- **Model 2:** Multiclass classifier → Mild / Moderate / Severe  

This modular structure allows independent improvement of each model.

---

##  FastAPI Backend

### **Main Endpoints**

