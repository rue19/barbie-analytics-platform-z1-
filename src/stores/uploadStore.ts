import { create } from 'zustand';
import { FileUploadState, Dataset } from '../types';

interface UploadActions {
  uploadFile: (file: File) => Promise<void>;
  clearUpload: () => void;
  setParsedData: (data: Dataset) => void;
}

const API_BASE = 'http://localhost:8000/api';

export const useUploadStore = create<FileUploadState & UploadActions>((set, get) => ({
  uploadedFile: null,
  parsedData: null,
  isLoading: false,
  error: null,

  uploadFile: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      // Validate file type
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        throw new Error('Please upload a valid Excel file');
      }

      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('File size must be less than 50MB');
      }

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const { parsedData, fileId } = await response.json();
      set({ uploadedFile: file, parsedData, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },

  clearUpload: () => {
    set({ uploadedFile: null, parsedData: null, error: null });
  },

  setParsedData: (data: Dataset) => {
    set({ parsedData: data });
  },
}));