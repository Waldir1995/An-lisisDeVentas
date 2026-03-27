import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Upload, FileSpreadsheet, FileText, AlertCircle } from 'lucide-react';
import { SalesData } from '../lib/utils';
import { parse, isValid } from 'date-fns';

interface FileUploadProps {
  onDataLoaded: (data: SalesData[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const processData = (rawData: any[]) => {
    const processed: SalesData[] = rawData.map((row) => {
      // Normalize keys: lowercase, remove accents, remove spaces
      const normalizedRow: any = {};
      Object.keys(row).forEach((key) => {
        const normalizedKey = key
          .toLowerCase()
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, '');
        normalizedRow[normalizedKey] = row[key];
      });

      const getVal = (keys: string[]) => {
        const foundKey = keys.find(k => normalizedRow[k] !== undefined);
        return foundKey ? normalizedRow[foundKey] : '';
      };

      let dateVal = getVal(['fecha', 'date']);
      let parsedDate: Date;

      if (dateVal instanceof Date) {
        parsedDate = dateVal;
      } else if (typeof dateVal === 'number') {
        // Excel serial date conversion if not automatically handled
        parsedDate = new Date((dateVal - 25569) * 86400 * 1000);
      } else {
        parsedDate = new Date(dateVal);
        if (!isValid(parsedDate)) {
          // Try common formats if standard parsing fails
          parsedDate = parse(String(dateVal), 'dd/MM/yyyy', new Date());
          if (!isValid(parsedDate)) {
            parsedDate = parse(String(dateVal), 'MM/dd/yyyy', new Date());
          }
        }
      }

      return {
        cliente: String(getVal(['cliente', 'customer']) || 'N/A'),
        pais: String(getVal(['pais', 'country']) || 'N/A'),
        canal: String(getVal(['canal', 'channel']) || 'N/A'),
        formaPago: String(getVal(['formadepago', 'paymentmethod']) || 'N/A'),
        producto: String(getVal(['producto', 'product']) || 'N/A'),
        vendedor: String(getVal(['vendedor', 'seller', 'salesperson']) || 'N/A'),
        fecha: isValid(parsedDate) ? parsedDate : new Date(),
        ventas: Number(getVal(['ventas', 'sales', 'amount']) || 0),
        cantidad: Number(getVal(['cantidad', 'quantity', 'qty']) || 0),
      };
    });

    onDataLoaded(processed);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          processData(results.data);
        },
      });
    } else {
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        processData(json);
      };
      reader.readAsBinaryString(file);
    }
  }, [onDataLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div
        {...getRootProps()}
        className={`glass-card p-12 text-center cursor-pointer transition-all duration-300 border-2 border-dashed ${
          isDragActive
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-white/10 hover:border-purple-400 hover:bg-white/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-6">
          <div className="p-5 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-2xl text-white shadow-xl shadow-purple-500/20">
            <Upload size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Cargar archivo de ventas</h3>
            <p className="text-slate-400">
              Arrastra y suelta tu archivo Excel o CSV aquí, o haz clic para seleccionar
            </p>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/5 px-4 py-2 rounded-xl border border-white/10 uppercase tracking-widest">
              <FileSpreadsheet size={16} className="text-green-400" />
              <span>XLSX / XLS</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/5 px-4 py-2 rounded-xl border border-white/10 uppercase tracking-widest">
              <FileText size={16} className="text-cyan-400" />
              <span>CSV</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-5 bg-purple-500/5 border border-purple-500/20 rounded-2xl flex gap-4 items-start">
        <AlertCircle className="text-purple-400 shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-slate-300">
          <p className="font-bold text-purple-400 uppercase tracking-widest text-[10px] mb-1">Columnas requeridas:</p>
          <p className="leading-relaxed opacity-80">
            Cliente, País, Canal, Forma de Pago, Producto, Vendedor, Fecha, Ventas, Cantidad.
          </p>
        </div>
      </div>
    </div>
  );
};
