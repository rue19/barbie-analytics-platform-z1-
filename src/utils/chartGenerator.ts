// src/utils/chartGenerator.ts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions as ChartJSOptions,
} from 'chart.js';
import { Dataset, ChartType, ChartOptions } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const generateChartConfig = (
  dataset: Dataset,
  chartType: ChartType,
  options: ChartOptions
) => {
  const baseConfig = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: options.title },
    },
  };

  switch (chartType) {
    case 'bar':
      return {
        ...baseConfig,
        type: 'bar' as const,
        data: {
          labels: dataset.data.map(row => row[0]),
          datasets: [{
            label: options.yAxis,
            data: dataset.data.map(row => row[1]),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
          }],
        },
      };

    case 'pie':
      return {
        ...baseConfig,
        type: 'pie' as const,
        data: {
          labels: dataset.data.map(row => row[0]),
          datasets: [{
            data: dataset.data.map(row => row[1]),
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
            ],
          }],
        },
      };

    case 'line':
      return {
        ...baseConfig,
        type: 'line' as const,
        data: {
          labels: dataset.data.map(row => row[0]),
          datasets: [{
            label: options.yAxis,
            data: dataset.data.map(row => row[1]),
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          }],
        },
      };

    default:
      throw new Error(`Unsupported chart type: ${chartType}`);
  }
};