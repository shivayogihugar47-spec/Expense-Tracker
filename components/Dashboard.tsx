import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
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

  const percentageSpent = Math.min(
    100,
    Math.round((stats.totalSpent / stats.totalBudget) * 100)
  );
  const isOverBudget = stats.remaining < 0;

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-50">
      {/* Centered board, fixed height, no scroll */}
      <div className="mx-auto flex h-full max-w-6xl flex-col px-6 py-5">
        {/* Top: title */}
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Kitchen Budget
            </h1>
            <p className="text-sm text-slate-400">
              Snapshot of your project in a single screen.
            </p>
          </div>
          <div className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
            Overview • No scrolling
          </div>
        </header>

        {/* Middle: 2-column fixed grid */}
        <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-[1.1fr_1fr]">
          {/* Left column: stats + progress + pie */}
          <div className="flex flex-col gap-4">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Total Budget */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Total Budget
                  </span>
                  <Wallet className="h-4 w-4 text-slate-400" />
                </div>
                <p className="text-xl font-semibold">
                  {formatCurrency(stats.totalBudget)}
                </p>
              </div>

              {/* Total Spent */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Spent
                  </span>
                  <TrendingUp className="h-4 w-4 text-slate-400" />
                </div>
                <p className="text-xl font-semibold text-amber-300">
                  {formatCurrency(stats.totalSpent)}
                </p>
              </div>

              {/* Remaining / Over budget */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    {isOverBudget ? "Over Budget" : "Remaining"}
                  </span>
                  <AlertCircle
                    className={`h-4 w-4 ${
                      isOverBudget ? "text-red-400" : "text-emerald-400"
                    }`}
                  />
                </div>
                <p
                  className={`text-xl font-semibold ${
                    isOverBudget ? "text-red-300" : "text-emerald-300"
                  }`}
                >
                  {formatCurrency(stats.remaining)}
                </p>
              </div>
            </div>

            {/* Progress bar (compact) */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">Budget used</span>
                <span
                  className={
                    percentageSpent > 90
                      ? "text-red-300"
                      : "text-blue-300"
                  }
                >
                  {percentageSpent}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${
                    percentageSpent > 90
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${percentageSpent}%` }}
                />
              </div>
            </div>

            {/* Pie chart area – fixed height so whole page stays fixed */}
            <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">Expense distribution</span>
                <span className="text-slate-500">
                  {transactions.length} txns
                </span>
              </div>

              {data.length > 0 ? (
                <div className="h-[230px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {data.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={CATEGORY_COLORS[entry.name as Category]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => formatCurrency(v)}
                        contentStyle={{
                          backgroundColor: "#020617",
                          border: "1px solid #1f2937",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        itemStyle={{ color: "#e5e7eb" }}
                        labelStyle={{ color: "#9ca3af" }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{
                          paddingTop: 4,
                          fontSize: 11,
                          color: "#9ca3af",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-[230px] items-center justify-center text-sm text-slate-500">
                  No expenses yet
                </div>
              )}
            </div>
          </div>

          {/* Right column: simple status panel */}
          <div className="flex flex-col gap-4">
            <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/80 px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                Project status
              </p>
              <h2 className="mt-2 text-lg font-semibold">
                Kitchen project at a glance
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Track all material and labour costs in one clean screen. No
                scrolling, no noise.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2">
                  <p className="text-slate-400">Total transactions</p>
                  <p className="mt-1 text-xl font-semibold">
                    {transactions.length}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2">
                  <p className="text-slate-400">Utilisation band</p>
                  <p className="mt-1 text-sm font-semibold">
                    {percentageSpent <= 70
                      ? "Safe"
                      : percentageSpent <= 90
                      ? "Caution"
                      : "Critical"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer hint */}
            <div className="rounded-xl border border-dashed border-slate-800 px-4 py-3 text-xs text-slate-500">
              This layout is designed to stay inside one screen.  
              If you add more widgets, adjust heights or grid to keep it non‑scroll.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

