import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import { DashboardStats } from '../lib/utils';
import { motion } from 'motion/react';

interface KPIsProps {
  stats: DashboardStats;
}

export const KPIs: React.FC<KPIsProps> = ({ stats }) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  const formatNumber = (val: number) =>
    new Intl.NumberFormat('es-CO').format(val);

  return (
    <div className="flex flex-col gap-6">
      {/* Main Large Stat */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 relative overflow-hidden"
      >
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-medium mb-1">Ventas Totales</p>
          <h2 className="text-5xl font-bold text-white tracking-tight mb-4 neon-text-purple">
            {formatNumber(stats.totalSales)}
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-1.5 w-48 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 w-[75%]"></div>
            </div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">Actividad actual</span>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
      </motion.div>

      {/* Grid of smaller stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Cantidad Vendida', val: formatNumber(stats.totalUnits), icon: ShoppingBag, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
          { label: 'Ticket Promedio', val: formatCurrency(stats.avgOrderValue), icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400/10' },
          { label: 'Clientes Únicos', val: formatNumber(stats.totalCustomers), icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' }
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
                <kpi.icon size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
                <p className="text-lg font-bold text-white">{kpi.val}</p>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
