import React, { useState, useMemo, useEffect } from 'react';
import { Search, Trash2, Download, Share2, Calendar, FileText, Sparkles } from 'lucide-react';
import { analysisService } from '../services/analysisService';
import { useAuthStore } from '../stores/authStore';

interface AnalysisHistory {
  id: string;
  fileName: string;
  date: Date;
  chartType: string;
  description?: string;
  dataPoints: number;
}

const HistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const loadAnalyses = async () => {
      if (user) {
        try {
          // This would fetch from your real backend
          // const userAnalyses = await analysisService.getUserAnalyses(user.id);
          // For now, using mock data
          await new Promise(resolve => setTimeout(resolve, 1000));
          setAnalyses(mockHistory);
        } catch (error) {
          console.error('Failed to load analyses:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadAnalyses();
  }, [user]);

  // Mock data - replace with real API call
  const mockHistory: AnalysisHistory[] = [
    {
      id: '1',
      fileName: 'Sales_Data_2024.xlsx',
      date: new Date('2024-01-15'),
      chartType: 'Bar Chart',
      description: 'Quarterly sales analysis',
      dataPoints: 150,
    },
    {
      id: '2',
      fileName: 'Customer_Survey.xlsx',
      date: new Date('2024-01-10'),
      chartType: 'Pie Chart',
      description: 'Customer satisfaction ratings',
      dataPoints: 89,
    },
    {
      id: '3',
      fileName: 'Website_Analytics.xlsx',
      date: new Date('2024-01-05'),
      chartType: 'Line Chart',
      description: 'Monthly traffic trends',
      dataPoints: 365,
    },
  ];

  const filteredHistory = useMemo(() => {
    return analyses.filter(item =>
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [analyses, searchTerm]);

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(
      selectedItems.length === filteredHistory.length
        ? []
        : filteredHistory.map(item => item.id)
    );
  };

  const deleteSelected = async () => {
    // In real app, this would call an API
    console.log('Deleting:', selectedItems);
    // await analysisService.deleteAnalyses(selectedItems);
    setSelectedItems([]);
    // Reload analyses
    setAnalyses(prev => prev.filter(item => !selectedItems.includes(item.id)));
  };

  const exportHistory = () => {
    const dataToExport = filteredHistory.filter(item => selectedItems.includes(item.id));
    console.log('Exporting:', dataToExport);
    // Implement export logic
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Sparkles className="text-barbie-500 animate-pulse" size={24} />
            <p className="text-barbie-600 font-medium">Loading your fabulous analyses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-barbie-600">Analysis History</h1>
        <div className="flex gap-2">
          {selectedItems.length > 0 && (
            <>
              <button
                onClick={deleteSelected}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 size={16} />
                Delete ({selectedItems.length})
              </button>
              <button
                onClick={exportHistory}
                className="flex items-center gap-2 px-4 py-2 bg-barbie-500 text-white rounded-lg hover:bg-barbie-600 transition-colors"
              >
                <Download size={16} />
                Export
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-barbie-100">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-barbie-400" size={20} />
              <input
                type="text"
                placeholder="Search your fabulous analyses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-barbie-200 rounded-xl focus:ring-2 focus:ring-barbie-500 focus:border-barbie-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analysis List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-barbie-100">
        <div className="px-6 py-4 border-b border-barbie-200 bg-barbie-50">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedItems.length === filteredHistory.length && filteredHistory.length > 0}
              onChange={selectAll}
              className="h-4 w-4 text-barbie-600 rounded"
            />
            <span className="ml-3 text-sm font-medium text-barbie-700">
              {selectedItems.length} selected of {filteredHistory.length} analyses
            </span>
          </div>
        </div>

        <div className="divide-y divide-barbie-100">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="px-6 py-4 hover:bg-barbie-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    className="h-4 w-4 text-barbie-600 rounded"
                  />
                  
                  <FileText className="text-barbie-500" size={24} />
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.fileName}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-barbie-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {item.date.toLocaleDateString()}
                      </div>
                      <span>•</span>
                      <span>{item.chartType}</span>
                      <span>•</span>
                      <span>{item.dataPoints} data points</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-barbie-400 hover:text-barbie-600 transition-colors hover:bg-barbie-100 rounded-lg"
                    title="Share"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    className="p-2 text-barbie-400 hover:text-red-600 transition-colors hover:bg-red-50 rounded-lg"
                    title="Delete"
                    onClick={() => toggleSelectItem(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    className="p-2 text-barbie-400 hover:text-green-600 transition-colors hover:bg-green-50 rounded-lg"
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto text-barbie-300 mb-4" size={48} />
            <p className="text-barbie-500">No fabulous analyses found</p>
            <p className="text-barbie-400 text-sm mt-1">
              {searchTerm ? 'Try adjusting your search terms' : 'Upload your first Excel file to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-barbie-600">
          Showing {filteredHistory.length} of {analyses.length} fabulous analyses
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-barbie-300 rounded-lg text-barbie-600 hover:bg-barbie-50 transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 border border-barbie-300 rounded-lg text-barbie-600 hover:bg-barbie-50 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;