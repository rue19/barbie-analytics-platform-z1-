import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useUploadStore } from '../stores/uploadStore';
import { Upload, FileText, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

const UploadPage: React.FC = () => {
  const { uploadFile, isLoading, error, uploadedFile, parsedData } = useUploadStore();
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      await uploadFile(acceptedFiles[0]);
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  const proceedToDashboard = () => {
    if (parsedData) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="text-barbie-500 mr-2" size={24} />
          <h1 className="text-3xl font-bold text-barbie-600">Upload Your Excel File</h1>
        </div>
        <p className="text-gray-600">Make your data fabulous! Upload your Excel file to create amazing pink visualizations</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-barbie-500 bg-barbie-50 shadow-lg'
              : 'border-barbie-300 hover:border-barbie-400 bg-white/80 backdrop-blur-sm'
          } ${isLoading ? 'opacity-50' : ''}`}
        >
          <input {...getInputProps()} disabled={isLoading} />
          
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-barbie-500 mb-4"></div>
              <p className="text-gray-600">Making your file fabulous...</p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto mb-4 text-barbie-400" size={48} />
              <p className="text-lg font-medium text-gray-700 mb-2">
                {isDragActive ? 'Drop the file here!' : 'Drag & drop your Excel file'}
              </p>
              <p className="text-gray-500 mb-4">or click to browse</p>
              <p className="text-sm text-barbie-500">Supports .xlsx, .xls (Max 50MB)</p>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-barbie-100 p-6">
          <div className="flex items-center mb-4">
            <CheckCircle2 className="text-barbie-500 mr-3" size={24} />
            <div>
              <p className="font-medium text-gray-900">{uploadedFile.name}</p>
              <p className="text-gray-600 text-sm">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {parsedData?.metadata.rowCount} rows • {parsedData?.metadata.columnCount} columns
              </p>
            </div>
          </div>

          {parsedData && (
            <>
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Data Preview</h3>
                <div className="border border-barbie-100 rounded-xl overflow-hidden">
                  <table className="min-w-full divide-y divide-barbie-100">
                    <thead className="bg-barbie-50">
                      <tr>
                        {parsedData.headers.map((header, index) => (
                          <th key={index} className="px-4 py-3 text-left text-xs font-medium text-barbie-600 uppercase">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-barbie-50">
                      {parsedData.data.slice(0, 5).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-2 text-sm text-gray-900">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedData.data.length > 5 && (
                  <p className="text-sm text-barbie-500 mt-2">
                    Showing first 5 of {parsedData.data.length} rows
                  </p>
                )}
              </div>

              <button
                onClick={proceedToDashboard}
                className="w-full bg-barbie-500 text-white py-3 px-4 rounded-xl hover:bg-barbie-600 font-medium shadow-lg hover:shadow-barbie-200 transition-all duration-300 hover:scale-105"
              >
                Create Fabulous Visualizations
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadPage;