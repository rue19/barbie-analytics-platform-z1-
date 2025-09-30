import React, { useState, useMemo, useRef } from 'react';
import { useUploadStore } from '../stores/uploadStore';
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
  ScatterController,
  BubbleController,
} from 'chart.js';
import { Bar, Line, Pie, Scatter, Bubble } from 'react-chartjs-2';
import { Download, Settings, BarChart3, PieChart, TrendingUp, ScatterChart, Grid, Brain, Filter } from 'lucide-react';
import { generateAIInsights, suggestChartTypes } from '../utils/aiInsights';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
  BubbleController
);

const DashboardPage: React.FC = () => {
  const { parsedData } = useUploadStore();
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'scatter' | 'bubble'>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [zAxis, setZAxis] = useState<string>('');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const chartRef = useRef<any>();

  // Set default axes when data loads
  useMemo(() => {
    if (parsedData && parsedData.headers.length >= 2) {
      setXAxis(parsedData.headers[0]);
      setYAxis(parsedData.headers[1]);
      if (parsedData.headers.length >= 3) {
        setZAxis(parsedData.headers[2]);
      }
    }
  }, [parsedData]);

  const filteredData = useMemo(() => {
    if (!parsedData) return null;

    const filteredRows = parsedData.data.filter(row => {
      return Object.entries(filters).every(([header, value]) => {
        const index = parsedData.headers.indexOf(header);
        if (index === -1) return true;
        if (value === '') return true;
        return String(row[index]).toLowerCase().includes(String(value).toLowerCase());
      });
    });

    return {
      ...parsedData,
      data: filteredRows,
      metadata: {
        ...parsedData.metadata,
        rowCount: filteredRows.length,
      },
    };
  }, [parsedData, filters]);

  const chartData = useMemo(() => {
    if (!filteredData || !xAxis || !yAxis) return null;

    const xIndex = filteredData.headers.indexOf(xAxis);
    const yIndex = filteredData.headers.indexOf(yAxis);
    const zIndex = zAxis ? filteredData.headers.indexOf(zAxis) : -1;

    if (xIndex === -1 || yIndex === -1) return null;

    if (chartType === 'scatter' || chartType === 'bubble') {
      const points = filteredData.data.map(row => ({
        x: parseFloat(row[xIndex]) || 0,
        y: parseFloat(row[yIndex]) || 0,
        r: chartType === 'bubble' && zIndex !== -1 ? (parseFloat(row[zIndex]) || 1) * 5 : 5,
      }));

      return {
        datasets: [
          {
            label: `${yAxis} vs ${xAxis}`,
            data: points,
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
          },
        ],
      };
    }

    const labels = filteredData.data.map(row => row[xIndex]);
    const data = filteredData.data.map(row => parseFloat(row[yIndex]) || 0);

    return {
      labels,
      datasets: [
        {
          label: yAxis,
          data,
          backgroundColor: 
            chartType === 'bar' ? 'rgba(59, 130, 246, 0.5)' :
            chartType === 'pie' ? [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
            ] : 'rgba(59, 130, 246, 0.1)',
          borderColor: chartType === 'line' ? 'rgba(59, 130, 246, 1)' : undefined,
          borderWidth: chartType === 'line' ? 2 : 1,
        },
      ],
    };
  }, [filteredData, xAxis, yAxis, zAxis, chartType]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${yAxis} by ${xAxis}` + (zAxis ? ` (Size: ${zAxis})` : ''),
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            if (chartType === 'bubble') {
              return `${yAxis}: ${context.parsed.y}, ${xAxis}: ${context.parsed.x}`;
            }
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: chartType === 'scatter' || chartType === 'bubble' ? {
      x: {
        title: { display: true, text: xAxis }
      },
      y: {
        title: { display: true, text: yAxis }
      }
    } : undefined,
  };

  const aiInsights = useMemo(() => {
    if (!filteredData) return null;
    return generateAIInsights(filteredData);
  }, [filteredData]);

  const suggestedCharts = useMemo(() => {
    if (!parsedData) return [];
    return suggestChartTypes(parsedData);
  }, [parsedData]);

  const exportChart = (format: 'png' | 'csv') => {
    if (format === 'png' && chartRef.current) {
      const link = document.createElement('a');
      link.download = `chart-${new Date().getTime()}.png`;
      link.href = chartRef.current.toBase64Image();
      link.click();
    } else if (format === 'csv' && filteredData) {
      const csvContent = [
        filteredData.headers.join(','),
        ...filteredData.data.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const link = document.createElement('a');
      link.download = `data-${new Date().getTime()}.csv`;
      link.href = URL.createObjectURL(blob);
      link.click();
    }
  };

  if (!parsedData) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <BarChart3 className="mx-auto mb-4 text-yellow-600" size={48} />
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">No Data Available</h2>
          <p className="text-yellow-700">Please upload an Excel file first to start visualizing data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Data Visualization</h1>
       
        <div className="flex gap-2">
  <button
    onClick={() => exportChart('png')}
    className="flex items-center gap-2 px-4 py-2 bg-barbie-500 text-white rounded-lg hover:bg-barbie-600 shadow-lg hover:shadow-barbie-200 transition-all duration-300"
  >
    <Download size={16} />
    Export PNG
  </button>
  <button
    onClick={() => exportChart('csv')}
    className="flex items-center gap-2 px-4 py-2 bg-barbie-400 text-white rounded-lg hover:bg-barbie-500 shadow-lg hover:shadow-barbie-200 transition-all duration-300"
  >
    <Download size={16} />
    Export CSV
  </button>
</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-gray-900 mb-4">Chart Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chart Type
                </label>
                <div className="space-y-2">
                  {[
                    { type: 'bar', label: 'Bar Chart', icon: BarChart3 },
                    { type: 'line', label: 'Line Chart', icon: TrendingUp },
                    { type: 'pie', label: 'Pie Chart', icon: PieChart },
                    { type: 'scatter', label: 'Scatter Plot', icon: ScatterChart },
                    { type: 'bubble', label: 'Bubble Chart', icon: Grid },
                  ].map(({ type, label, icon: Icon }) => (
                    <button
                      key={type}
                      onClick={() => setChartType(type as any)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                   chartType === type
                       ? 'border-barbie-500 bg-barbie-50 text-barbie-700 shadow-lg'
                       : 'border-gray-200 hover:border-barbie-300 hover:bg-barbie-25'
                    }`}  
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  X-Axis (Category)
                </label>
                <select
                  value={xAxis}
                  onChange={(e) => setXAxis(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select column</option>
                  {parsedData.headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Y-Axis (Value)
                </label>
                <select
                  value={yAxis}
                  onChange={(e) => setYAxis(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select column</option>
                  {parsedData.headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>

              {(chartType === 'bubble') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Z-Axis (Size)
                  </label>
                  <select
                    value={zAxis}
                    onChange={(e) => setZAxis(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select column</option>
                    {parsedData.headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">AI Insights</h3>
              <button
                onClick={() => setShowAIInsights(!showAIInsights)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Brain size={16} />
                {showAIInsights ? 'Hide' : 'Show'} Insights
              </button>
            </div>
            
            {showAIInsights && aiInsights && (
              <div className="space-y-3">
                {aiInsights.trends.map((trend, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{trend}</p>
                  </div>
                ))}
                {aiInsights.anomalies.map((anomaly, index) => (
                  <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">{anomaly}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Data Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={16} />
              <h3 className="font-medium text-gray-900">Data Filters</h3>
            </div>
            <div className="space-y-3">
              {parsedData.headers.slice(0, 3).map((header) => (
                <div key={header}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {header}
                  </label>
                  <input
                    type="text"
                    value={filters[header] || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      [header]: e.target.value
                    }))}
                    placeholder={`Filter ${header}...`}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
          {chartData ? (
            <div className="h-96">
              {chartType === 'bar' && <Bar ref={chartRef} data={chartData} options={chartOptions} />}
              {chartType === 'line' && <Line ref={chartRef} data={chartData} options={chartOptions} />}
              {chartType === 'pie' && <Pie ref={chartRef} data={chartData} options={chartOptions} />}
              {chartType === 'scatter' && <Scatter ref={chartRef} data={chartData} options={chartOptions} />}
              {chartType === 'bubble' && <Bubble ref={chartRef} data={chartData} options={chartOptions} />}
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              Please select both X and Y axes to generate the chart
            </div>
          )}
          
          {/* Chart Suggestions */}
          {suggestedCharts.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Suggested Chart Types</h4>
              <div className="flex flex-wrap gap-2">
                {suggestedCharts.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setChartType(suggestion.type as any)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;