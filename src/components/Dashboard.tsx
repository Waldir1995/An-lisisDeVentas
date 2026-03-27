import React, { useState, useMemo } from 'react';
import { SalesData, DashboardStats } from '../lib/utils';
import { Filters } from './Filters';
import { KPIs } from './KPIs';
import { Charts } from './Charts';
import { DataTable } from './DataTable';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Download, RefreshCcw, ChevronRight } from 'lucide-react';

interface DashboardProps {
  data: SalesData[];
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  const [filters, setFilters] = useState({
    pais: '',
    canal: '',
    vendedor: '',
    producto: '',
    formaPago: '',
    startDate: '',
    endDate: '',
  });

  const options = useMemo(() => {
    return {
      paises: Array.from(new Set(data.map((d) => d.pais))).sort(),
      canales: Array.from(new Set(data.map((d) => d.canal))).sort(),
      vendedores: Array.from(new Set(data.map((d) => d.vendedor))).sort(),
      productos: Array.from(new Set(data.map((d) => d.producto))).sort(),
      formasPago: Array.from(new Set(data.map((d) => d.formaPago))).sort(),
    };
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchPais = !filters.pais || item.pais === filters.pais;
      const matchCanal = !filters.canal || item.canal === filters.canal;
      const matchVendedor = !filters.vendedor || item.vendedor === filters.vendedor;
      const matchProducto = !filters.producto || item.producto === filters.producto;
      const matchFormaPago = !filters.formaPago || item.formaPago === filters.formaPago;

      let matchDate = true;
      if (filters.startDate || filters.endDate) {
        const start = filters.startDate ? startOfDay(parseISO(filters.startDate)) : new Date(0);
        const end = filters.endDate ? endOfDay(parseISO(filters.endDate)) : new Date(8640000000000000);
        matchDate = isWithinInterval(item.fecha, { start, end });
      }

      return matchPais && matchCanal && matchVendedor && matchProducto && matchFormaPago && matchDate;
    });
  }, [data, filters]);

  const stats: DashboardStats = useMemo(() => {
    const totalSales = filteredData.reduce((acc, curr) => acc + curr.ventas, 0);
    const totalUnits = filteredData.reduce((acc, curr) => acc + curr.cantidad, 0);
    const totalCustomers = new Set(filteredData.map((d) => d.cliente)).size;

    return {
      totalSales,
      totalUnits,
      totalCustomers,
      avgOrderValue: filteredData.length > 0 ? totalSales / filteredData.length : 0,
    };
  }, [filteredData]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      pais: '',
      canal: '',
      vendedor: '',
      producto: '',
      formaPago: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className="px-8 py-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-slate-300">Estadísticas generales</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Estadísticas generales</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-sm">Todos los usuarios</span>
            <button className="text-xs text-purple-400 font-semibold hover:underline flex items-center gap-1">
              DETALLE <ChevronRight size={12} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 transition-all text-sm font-medium flex items-center gap-2"
          >
            <RefreshCcw size={16} />
            Cambiar archivo
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all text-sm font-medium flex items-center gap-2"
          >
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      <Filters
        filters={filters}
        options={options}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column - Main Stats & Charts */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          <KPIs stats={stats} />
          <Charts data={filteredData} />
        </div>

        {/* Right Column - Secondary Stats & Table */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Más comprometidos</h3>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400">
                  <RefreshCcw size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Todos los usuarios</p>
                  <p className="text-xl font-bold text-white">2,340 <span className="text-xs text-green-400 ml-1">▲ 145</span></p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 flex items-center justify-center text-cyan-400">
                  <RefreshCcw size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Usuarios únicos recientes</p>
                  <p className="text-xl font-bold text-white">1,204,540</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <h4 className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-wider">Pronóstico</h4>
              <div className="mb-6">
                <p className="text-xs text-slate-500 mb-1">Mensual</p>
                <p className="text-2xl font-bold text-white">32,540 <span className="text-xs text-green-400 ml-1">▲ 10%</span></p>
                <p className="text-[10px] text-slate-600">Comparado con 21,490 el año pasado</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Anual</p>
                <p className="text-2xl font-bold text-white">1,387,075 <span className="text-xs text-green-400 ml-1">▲ 12%</span></p>
                <p className="text-[10px] text-slate-600">Comparado con 21,490 el año pasado</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Estadística Temporal</h3>
            <div className="space-y-6">
              {[
                { label: 'Enero', val: 613, color: 'bg-cyan-400' },
                { label: 'Febrero', val: 613, color: 'bg-orange-400' },
                { label: 'Marzo', val: 613, color: 'bg-purple-400' }
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>{item.label}</span>
                    <span>{item.val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full w-[60%]`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Width Table */}
        <div className="xl:col-span-12">
          <DataTable data={filteredData} />
        </div>
      </div>
    </div>
  );
};
