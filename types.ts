export enum Category {
  MATERIAL = 'Material',
  LABOR = 'Labor',
  APPLIANCES = 'Appliances',
  MISCELLANEOUS = 'Miscellaneous',
  FEES = 'Fees & Permits'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: 'expense' | 'bill';
  vendor?: string; // Specific for bills
  attachmentName?: string; // Name of uploaded file
  attachmentData?: string; // Base64 string (optional, kept small for localStorage)
}

export interface BudgetStats {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
}