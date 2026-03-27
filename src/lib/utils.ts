import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SalesData {
  cliente: string;
  pais: string;
  canal: string;
  formaPago: string;
  producto: string;
  vendedor: string;
  fecha: Date;
  ventas: number;
  cantidad: number;
}

export interface DashboardStats {
  totalSales: number;
  totalUnits: number;
  avgOrderValue: number;
  totalCustomers: number;
}
