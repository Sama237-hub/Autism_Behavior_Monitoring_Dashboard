const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const apiService = {
  // Get real metrics from your backend
  async getDashboardMetrics() {
    try {
      const response = await fetch(`${API_BASE}/api/metrics`);
      if (!response.ok) throw new Error('Failed to fetch metrics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching metrics:', error);
      // Return mock data only if API fails
      return {
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        totalPatients: 0
      };
    }
  },

  // Get real predictions data
  async getPredictions() {
    try {
      const response = await fetch(`${API_BASE}/api/predictions`);
      if (!response.ok) throw new Error('Failed to fetch predictions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return [];
    }
  },

  // Upload CSV for real analysis
  async uploadCSV(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${API_BASE}/api/upload-csv`, {
        method: 'POST',
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }
  }
};