// Add these to your existing types
export interface AIInsights {
  trends: string[];
  anomalies: string[];
  summary: string;
  suggestions: string[];
}

export interface AnalysisHistory {
  id: string;
  fileName: string;
  date: Date;
  chartType: string;
  description?: string;
  dataPoints: number;
}