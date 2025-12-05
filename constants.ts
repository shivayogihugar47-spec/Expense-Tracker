import { Category } from './types';

export const TOTAL_BUDGET = 250600;

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.MATERIAL]: '#3b82f6', // blue-500
  [Category.LABOR]: '#f59e0b', // amber-500
  [Category.APPLIANCES]: '#10b981', // emerald-500
  [Category.MISCELLANEOUS]: '#64748b', // slate-500
  [Category.FEES]: '#ef4444', // red-500
};

export const INITIAL_TRANSACTIONS = [];