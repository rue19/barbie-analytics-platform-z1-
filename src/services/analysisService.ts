import { Analysis } from '../types';

const API_BASE = 'http://localhost:8000/api';

export const analysisService = {
  // Create new analysis
  createAnalysis: async (analysisData: {
    fileId: string;
    chartType: string;
    chartData: any;
    description?: string;
    isPublic?: boolean;
  }): Promise<Analysis> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/analysis/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(analysisData),
    });

    if (!response.ok) {
      throw new Error('Failed to create analysis');
    }

    return response.json();
  },

  // Get user's analyses
  getUserAnalyses: async (userId: string): Promise<Analysis[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/analysis/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analyses');
    }

    return response.json();
  },

  // Save analysis to history
  saveAnalysis: async (analysis: Partial<Analysis>): Promise<void> => {
    // This would call your backend to save the analysis
    console.log('Saving analysis:', analysis);
    // Implement based on your backend API
  },
};