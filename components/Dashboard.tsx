import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Transaction, BudgetStats, Category } from "../types";
import { CATEGORY_COLORS } from "../constants";
import { Wallet, TrendingUp, AlertCircle } from "lucide-react";

interface DashboardProps {
  stats: BudgetStats;
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, transactions }) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const data = Object.values(Category)
    .map((cat) => {
      const value = transactions
        .filter((t) => t.category === cat)
        .reduce((s, t) => s + t.amount, 0);
      return { name: cat, value };
    })
    .filter((d) => d.value > 0);

  const percentageSpent = Math.min(100, Math.round((stats.totalSpent / stats.totalBudget) * 100));

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ======================== STATS CARDS ======================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Wallet className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Budget</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{formatCurrency(stats.totalBudget)}</p>
            </div>
          </div>
        </div>

        {/* CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Spent</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{formatCurrency(stats.totalSpent)}</p>
            </div>
          </div>
        </div>

        {/* CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${
                stats.remaining < 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <AlertCircle className="w-7 h-7" />
            </div>

            <div>
              <p className="text-sm text-slate-500 font-medium">Remaining</p>
              <p
                className={`text-3xl font-bold mt-1 ${
                  stats.remaining < 0 ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {formatCurrency(stats.remaining)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================== PROGRESS BAR ======================== */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
        <div className="flex justify-between mb-3">
          <span className="text-sm font-semibold text-slate-700 tracking-wide">
            Budget Utilization
          </span>
          <span className="text-sm font-semibold text-slate-700">{percentageSpent}%</span>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              percentageSpent > 90 ? "bg-red-500" : "bg-blue-600"
            }`}
            style={{ width: `${percentageSpent}%` }}
          />
        </div>
      </div>

      {/* ======================== PIE CHART + SIDE CARD ======================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PIE CHART CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 min-h-[330px]">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Expense Distribution</h3>

          {data.length > 0 ? (
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={CATEGORY_COLORS[entry.name as Category]}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              No expenses yet.
            </div>
          )}
        </div>

        {/* STATUS CARD */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-xl text-white flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold">Kitchen Project Status</h3>
            <p className="text-blue-100 mt-1">
              Keep track of every rupee to ensure your dream kitchen stays within budget.
            </p>
          </div>

          <div className="mt-6">
            <div className="text-sm text-blue-200 uppercase tracking-wider font-semibold">
              Total Transactions
            </div>
            <div className="text-5xl font-bold mt-1">{transactions.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
