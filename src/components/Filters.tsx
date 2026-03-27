import React from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

interface FiltersProps {
  filters: {
    pais: string;
    canal: string;
    vendedor: string;
    producto: string;
    formaPago: string;
    startDate: string;
    endDate: string;
  };
  options: {
    paises: string[];
    canales: string[];
    vendedores: string[];
    productos: string[];
    formasPago: string[];
  };
  onFilterChange: (name: string, value: string) => void;
  onReset: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ filters, options, onFilterChange, onReset }) => {
  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Filter size={18} className="text-purple-400" />
          <span>Filtros de Análisis</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-purple-400 flex items-center gap-1 transition-colors uppercase tracking-wider font-bold"
        >
          <X size={14} />
          Reiniciar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {/* Date Filters */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inicio</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-xs text-slate-300"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fin</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-xs text-slate-300"
          />
        </div>

        {/* Select Filters */}
        {[
          { label: 'País', name: 'pais', options: options.paises },
          { label: 'Canal', name: 'canal', options: options.canales },
          { label: 'Vendedor', name: 'vendedor', options: options.vendedores },
          { label: 'Producto', name: 'producto', options: options.productos },
          { label: 'Pago', name: 'formaPago', options: options.formasPago },
        ].map((filter) => (
          <div key={filter.name} className="flex flex-col gap-1.5 relative">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{filter.label}</label>
            <div className="relative">
              <select
                value={(filters as any)[filter.name]}
                onChange={(e) => onFilterChange(filter.name, e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-xs text-slate-300 appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#16162D]">Todos</option>
                {filter.options.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#16162D]">
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
