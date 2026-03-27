/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { SalesData } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  LayoutGrid, 
  Settings, 
  Globe, 
  CreditCard, 
  User, 
  Bell,
  Search,
  Menu
} from 'lucide-react';

export default function App() {
  const [salesData, setSalesData] = useState<SalesData[] | null>(null);

  const handleDataLoaded = (data: SalesData[]) => {
    setSalesData(data);
  };

  const handleReset = () => {
    setSalesData(null);
  };

  return (
    <div className="min-h-screen bg-[#080812] flex text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 bg-[#0B0B1E] border-r border-white/5 flex flex-col items-center py-8 gap-8 shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 mb-4">
          <BarChart3 size={20} className="text-white" />
        </div>
        
        <nav className="flex flex-col gap-6 flex-1">
          {[LayoutGrid, BarChart3, Globe, CreditCard, Settings].map((Icon, i) => (
            <button key={i} className={`p-3 rounded-xl transition-all ${i === 1 ? 'bg-purple-600/20 text-purple-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
              <Icon size={22} />
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-6 mt-auto">
          <button className="p-3 text-slate-500 hover:text-slate-300">
            <Bell size={22} />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/30">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-[#080812]/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5 w-96">
            <Search size={18} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar estadísticas..." 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-300 placeholder:text-slate-600"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-200">Panel de Administración</p>
              <p className="text-xs text-slate-500">waldirgregory@gmail.com</p>
            </div>
            <button className="md:hidden p-2 text-slate-400">
              <Menu size={24} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {!salesData ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="container mx-auto px-8 py-16"
                >
                  <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                      Análisis de Ventas <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                        Inteligente y Visual
                      </span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                      Sube tus datos y visualiza estadísticas generales con una interfaz moderna inspirada en el futuro.
                    </p>
                  </div>
                  <FileUpload onDataLoaded={handleDataLoaded} />
                </motion.div>
              ) : (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Dashboard data={salesData} onReset={handleReset} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          <footer className="py-6 px-8 border-t border-white/5 bg-[#0B0B1E]/30 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Creado por: <span className="text-purple-400">Waldir Gregory Quispe Charaja</span> - <span className="text-slate-400 italic">Curso de Excel con IA</span>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
