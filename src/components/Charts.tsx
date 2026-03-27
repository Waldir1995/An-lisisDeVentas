import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { SalesData } from '../lib/utils';
import { format, startOfMonth } from 'date-fns';

interface ChartsProps {
  data: SalesData[];
}

const COLORS = ['#8B5CF6', '#06B6D4', '#EC4899', '#F59E0B', '#10B981'];

export const Charts: React.FC<ChartsProps> = ({ data }) => {
  // Process data for charts
  const salesByDate = data.reduce((acc: any[], curr) => {
    const month = format(startOfMonth(curr.fecha), 'MMM yyyy');
    const existing = acc.find((item) => item.name === month);
    if (existing) {
      existing.ventas += curr.ventas;
    } else {
      acc.push({ name: month, ventas: curr.ventas });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  const salesByCountry = data.reduce((acc: any[], curr) => {
    const existing = acc.find((item) => item.name === curr.pais);
    if (existing) {
      existing.value += curr.ventas;
    } else {
      acc.push({ name: curr.pais, value: curr.ventas });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value).slice(0, 5);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Trend Area Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-medium text-slate-400">Tendencia</h3>
            <p className="text-xs text-slate-600">Comparado con 12% el año pasado</p>
          </div>
          <p className="text-lg font-bold text-white">92,980</p>
        </div>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesByDate}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#16162D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
                formatter={(val: number) => formatCurrency(val)} 
              />
              <Area type="monotone" dataKey="ventas" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Country Distribution */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-medium text-slate-400 mb-6">Ventas por País</h3>
        <div className="space-y-4">
          {salesByCountry.map((item, idx) => (
            <div key={item.name} className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-400' : idx === 1 ? 'bg-green-400' : idx === 2 ? 'bg-orange-400' : 'bg-purple-400'}`}></div>
              <span className="text-xs text-slate-400 w-24 truncate">{item.name}</span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${idx === 0 ? 'bg-blue-400' : idx === 1 ? 'bg-green-400' : idx === 2 ? 'bg-orange-400' : 'bg-purple-400'} rounded-full`}
                  style={{ width: `${(item.value / salesByCountry[0].value) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-mono text-slate-300">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total Earning Mini Chart */}
      <div className="glass-card p-6 md:col-span-2">
        <div className="flex items-center gap-8">
          <div className="shrink-0">
            <h3 className="text-xs font-medium text-slate-500 mb-1">Ganancia total</h3>
            <p className="text-2xl font-bold text-white">$12,875 <span className="text-xs text-green-400 ml-1">▲ 10%</span></p>
            <p className="text-[10px] text-slate-600">Comparado con $21,490 el año pasado</p>
          </div>
          <div className="flex-1 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByDate.slice(-10)}>
                <Bar dataKey="ventas" fill="#8B5CF6" radius={[2, 2, 0, 0]} barSize={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
