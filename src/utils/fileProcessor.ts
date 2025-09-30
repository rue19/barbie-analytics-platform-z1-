// src/utils/fileProcessor.ts
import * as XLSX from 'xlsx';
import { Dataset, DataType } from '../types';

export const parseExcelFile = async (file: File): Promise<Dataset> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 1) {
          throw new Error('The sheet is empty');
        }

        const headers = jsonData[0] as string[];
        const dataRows = jsonData.slice(1) as any[][];
        const dataTypes = detectDataTypes(headers, dataRows);

        resolve({
          headers,
          data: dataRows,
          metadata: {
            rowCount: dataRows.length,
            columnCount: headers.length,
            dataTypes,
          },
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

const detectDataTypes = (headers: string[], data: any[][]): DataType[] => {
  return headers.map((_, colIndex) => {
    const columnData = data.map(row => row[colIndex]).filter(val => val != null);
    
    if (columnData.length === 0) return 'string';
    
    // Check for numbers
    if (columnData.every(val => !isNaN(Number(val)))) return 'number';
    
    // Check for dates
    if (columnData.every(val => !isNaN(Date.parse(val)))) return 'date';
    
    // Check for booleans
    if (columnData.every(val => 
      ['true', 'false', '1', '0'].includes(String(val).toLowerCase())
    )) return 'boolean';
    
    return 'string';
  });
};