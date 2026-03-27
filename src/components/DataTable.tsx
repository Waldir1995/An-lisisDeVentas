import React from 'react';
import { SalesData } from '../lib/utils';

interface DataTableProps {
  data: SalesData[];
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('es-CO').format(date);

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Detalle de Ventas</h3>
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{data.length} registros</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fecha</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cliente</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">País</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vendedor</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Producto</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Cant.</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Ventas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.slice(0, 50).map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">{formatDate(row.fecha)}</td>
                <td className="px-6 py-4 text-xs font-semibold text-white group-hover:text-purple-400 transition-colors">{row.cliente}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{row.pais}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{row.vendedor}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{row.producto}</td>
                <td className="px-6 py-4 text-xs text-slate-400 text-right font-mono">{row.cantidad}</td>
                <td className="px-6 py-4 text-xs font-bold text-white text-right font-mono">{formatCurrency(row.ventas)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 50 && (
        <div className="p-4 bg-white/5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-white/5">
          Mostrando 50 de {data.length} registros
        </div>
      )}
    </div>
  );
};
