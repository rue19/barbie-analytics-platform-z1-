import { Dataset } from '../types';

export interface AIInsights {
  trends: string[];
  anomalies: string[];
  summary: string;
  suggestions: string[];
}

export const generateAIInsights = (dataset: Dataset): AIInsights => {
  const insights: AIInsights = {
    trends: [],
    anomalies: [],
    summary: '',
    suggestions: [],
  };

  // Simple trend detection
  dataset.headers.forEach((header, index) => {
    const numericData = dataset.data
      .map(row => parseFloat(row[index]))
      .filter(val => !isNaN(val));
    
    if (numericData.length > 1) {
      const first = numericData[0];
      const last = numericData[numericData.length - 1];
      const trend = last > first ? 'increasing' : last < first ? 'decreasing' : 'stable';
      
      if (trend !== 'stable') {
        insights.trends.push(`${header} shows a ${trend} trend (${first} → ${last})`);
      }

      // Simple anomaly detection (values outside 2 standard deviations)
      const mean = numericData.reduce((a, b) => a + b, 0) / numericData.length;
      const stdDev = Math.sqrt(
        numericData.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / numericData.length
      );
      
      numericData.forEach((value, i) => {
        if (Math.abs(value - mean) > 2 * stdDev) {
          insights.anomalies.push(`Anomaly detected in ${header}: ${value} (row ${i + 1})`);
        }
      });
    }
  });

  insights.summary = `Dataset contains ${dataset.metadata.rowCount} rows and ${dataset.metadata.columnCount} columns. ${insights.trends.length} trends detected.`;
  
  insights.suggestions = [
    'Consider comparing different time periods',
    'Try different chart types for better insights',
    'Filter outliers for clearer trends',
  ];

  return insights;
};

export const suggestChartTypes = (dataset: Dataset): Array<{type: string, label: string}> => {
  const suggestions: Array<{type: string, label: string}> = [];
  const numericColumns = dataset.headers.filter((header, index) => {
    const numericData = dataset.data.map(row => parseFloat(row[index])).filter(val => !isNaN(val));
    return numericData.length > dataset.metadata.rowCount * 0.8; // 80% numeric
  });

  if (numericColumns.length >= 2) {
    suggestions.push({ type: 'scatter', label: 'Scatter Plot' });
    suggestions.push({ type: 'bubble', label: 'Bubble Chart' });
  }

  if (numericColumns.length >= 1 && dataset.metadata.rowCount < 20) {
    suggestions.push({ type: 'pie', label: 'Pie Chart' });
  }

  suggestions.push({ type: 'bar', label: 'Bar Chart' });
  suggestions.push({ type: 'line', label: 'Line Chart' });

  return suggestions;
};