export const SEVERITY_LEVELS = {
  MILD: {
    label: 'Mild',
    color: 'var(--accent-green)',
    description: 'Minimal support needed'
  },
  MODERATE: {
    label: 'Moderate', 
    color: 'var(--accent-orange)',
    description: 'Moderate support required'
  },
  SEVERE: {
    label: 'Severe',
    color: 'var(--accent-red)', 
    description: 'Substantial support needed'
  }
};

export const METRICS = {
  ACCURACY: 'accuracy',
  PRECISION: 'precision', 
  RECALL: 'recall',
  F1_SCORE: 'f1Score',
  AUC: 'auc'
};

export const CHART_COLORS = {
  PRIMARY: 'var(--primary-blue)',
  SECONDARY: 'var(--secondary-teal)',
  SUCCESS: 'var(--accent-green)',
  WARNING: 'var(--accent-orange)',
  ERROR: 'var(--accent-red)'
};

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200
};

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['text/csv', 'application/vnd.ms-excel'],
  REQUIRED_COLUMNS: ['age', 'gender']
};