import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, BudgetStats, Category } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { Wallet, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardProps {
  stats: BudgetStats;
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, transactions }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const data = Object.values(Category).map((cat) => {
    const value = transactions
      .filter((t) => t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat, value };
  }).filter(d => d.value > 0);

  const percentageSpent = Math.min(100, Math.round((stats.totalSpent / stats.totalBudget) * 100));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Budget</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(stats.totalBudget)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-full text-amber-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Spent</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(stats.totalSpent)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className={`p-3 rounded-full ${stats.remaining < 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Remaining</p>
            <p className={`text-2xl font-bold ${stats.remaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {formatCurrency(stats.remaining)}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
         <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Budget Utilization</span>
            <span className="text-sm font-medium text-slate-700">{percentageSpent}%</span>
         </div>
         <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${percentageSpent > 90 ? 'bg-red-500' : 'bg-blue-600'}`} 
              style={{ width: `${percentageSpent}%` }}
            ></div>
         </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 self-start">Expense Distribution</h3>
          {data.length > 0 ? (
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Category]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-400">
              <p>No expenses recorded yet.</p>
            </div>
          )}
        </div>
        
        {/* Recent Activity Mini-List could go here, but main list handles it well */}
        <div className="bg-blue-600 p-6 rounded-xl shadow-md text-white flex flex-col justify-between">
           <div>
             <h3 className="text-xl font-bold mb-2">Kitchen Project Status</h3>
             <p className="text-blue-100">Keep track of every rupee to ensure your dream kitchen stays within budget.</p>
           </div>
           <div className="mt-6">
             <div className="text-sm text-blue-200 uppercase tracking-wider font-semibold">Total Transactions</div>
             <div className="text-4xl font-bold mt-1">{transactions.length}</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;