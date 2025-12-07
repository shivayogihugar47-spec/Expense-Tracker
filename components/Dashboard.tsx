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
    <div className="space-y-8 animate-fade-in bg-slate-950/95 min-h-screen px-4 py-6 md:px-8 md:py-8">
      {/* Page header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
            Kitchen Budget Overview
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            A clear snapshot of how your kitchen project budget is performing in real time.
          </p>
        </div>

        <div className="inline-flex rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs text-slate-300 shadow-lg backdrop-blur-xl">
          <span className="mr-2 inline-flex h-2 w-2 translate-y-[2px] rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.35)]" />
          Live tracking enabled
        </div>
      </div>

      {/* ======================== STATS CARDS ======================== */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* CARD: Total Budget */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-900/40 p-[1px] shadow-2xl backdrop-blur-xl">
          <div className="relative h-full rounded-2xl bg-slate-950/60 p-5">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300 shadow-lg shadow-blue-500/30">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Total Budget
                </p>
                <p className="mt-1 text-3xl font-semibold text-slate-50">
                  {formatCurrency(stats.totalBudget)}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Planned ceiling for your kitchen project.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CARD: Total Spent */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/20 via-slate-900/60 to-slate-900/40 p-[1px] shadow-2xl backdrop-blur-xl">
          <div className="relative h-full rounded-2xl bg-slate-950/60 p-5">
            <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-amber-400/15 blur-2xl" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300 shadow-lg shadow-amber-500/30">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Total Spent
                </p>
                <p className="mt-1 text-3xl font-semibold text-slate-50">
                  {formatCurrency(stats.totalSpent)}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  All payments made so far for materials and labor.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CARD: Remaining */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-slate-900/60 to-slate-900/40 p-[1px] shadow-2xl backdrop-blur-xl">
          <div className="relative h-full rounded-2xl bg-slate-950/60 p-5">
            <div className="absolute bottom-[-40px] right-[-40px] h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl" />
            <div className="relative flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg ${
                  isOverBudget
                    ? "bg-red-500/15 text-red-300 shadow-red-500/30"
                    : "bg-emerald-500/15 text-emerald-300 shadow-emerald-500/30"
                }`}
              >
                <AlertCircle className="h-6 w-6" />
              </div>

              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  {isOverBudget ? "Over Budget" : "Remaining"}
                </p>
                <p
                  className={`mt-1 text-3xl font-semibold ${
                    isOverBudget ? "text-red-300" : "text-emerald-300"
                  }`}
                >
                  {formatCurrency(stats.remaining)}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {isOverBudget
                    ? "You have crossed your planned budget. Re‑prioritize upcoming work."
                    : "Amount still available to keep your kitchen within plan."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================== PROGRESS BAR ======================== */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Budget utilisation
            </p>
            <p className="mt-1 text-sm text-slate-300">
              {percentageSpent <= 70
                ? "You are in a comfortable zone. Keep tracking receipts as you go."
                : percentageSpent <= 90
                ? "You are approaching the upper limit. Monitor big purchases carefully."
                : "Critical zone. Pause and reassess the remaining work scope."}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              percentageSpent > 90
                ? "bg-red-500/10 text-red-300 ring-1 ring-red-500/40"
                : "bg-blue-500/10 text-blue-200 ring-1 ring-blue-500/30"
            }`}
          >
            {percentageSpent}% used
          </span>
        </div>

        <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800/80">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              percentageSpent > 90
                ? "bg-gradient-to-r from-red-500 via-orange-500 to-amber-400"
                : "bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-500"
            }`}
            style={{ width: `${percentageSpent}%` }}
          />
          {/* Soft glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full bg-white/5 blur-[6px]"
            aria-hidden="true"
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* ======================== PIE CHART + SIDE CARD ======================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* PIE CHART CARD */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-50">
                Expense distribution
              </h3>
              <p className="text-xs text-slate-400">
                How each category contributes to your total spend.
              </p>
            </div>
          </div>

          {data.length > 0 ? (
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow
                        dx="0"
                        dy="4"
                        stdDeviation="6"
                        floodColor="rgba(15,23,42,0.7)"
                      />
                    </filter>
                  </defs>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    strokeWidth={4}
                    stroke="rgba(15,23,42,1)"
                    style={{ filter: "url(#shadow)", cursor: "pointer" }}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={CATEGORY_COLORS[entry.name as Category]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background:
                        "linear-gradient(to bottom right, #020617, #020617)",
                      border: "1px solid rgba(148, 163, 184, 0.5)",
                      borderRadius: 12,
                      padding: 10,
                      boxShadow:
                        "0 18px 45px rgba(15, 23, 42, 0.75)",
                    }}
                    itemStyle={{
                      color: "#e5e7eb",
                      fontSize: 12,
                    }}
                    formatter={(v: number, _name: string) => [
                      formatCurrency(v),
                      "Amount",
                    ]}
                    labelStyle={{
                      color: "#9ca3af",
                      fontSize: 11,
                      marginBottom: 4,
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                      paddingTop: 8,
                      fontSize: 11,
                      color: "#9ca3af",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-56 flex-col items-center justify-center text-center">
              <span className="mb-2 text-sm font-medium text-slate-300">
                No expenses yet
              </span>
              <p className="max-w-xs text-xs text-slate-500">
                Start by logging your first material purchase or contractor payment to
                see this breakdown come alive.
              </p>
            </div>
          )}
        </div>

        {/* STATUS CARD */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-500/40 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-6 shadow-[0_25px_60px_rgba(30,64,175,0.65)] text-white">
          {/* Noise / glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.22),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.2),_transparent_55%)] mix-blend-screen opacity-90" />
          <div className="pointer-events-none absolute -right-16 top-10 h-40 w-40 rounded-full bg-blue-400/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-10 h-44 w-44 rounded-full bg-indigo-500/40 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100/70">
              Kitchen project status
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              Stay in control of every rupee.
            </h3>
            <p className="mt-2 text-sm text-blue-100/80">
              Track cabinet work, tiles, appliances, and labour at one place so
              your dream kitchen never surprises your wallet.
            </p>
          </div>

          <div className="relative mt-6 flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100/70">
                Total transactions
              </p>
              <p className="mt-1 text-5xl font-semibold leading-none">
                {transactions.length.toString().padStart(2, "0")}
              </p>
              <p className="mt-2 text-xs text-blue-100/80">
                Every entry helps you understand where the money is actually going.
              </p>
            </div>

            <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full bg-blue-500/25 px-3 py-1 backdrop-blur-md">
                Category‑wise spend tracking
              </span>
              <span className="rounded-full bg-indigo-500/30 px-3 py-1 backdrop-blur-md">
                Real‑time utilisation bar
              </span>
              <span className="rounded-full bg-sky-500/25 px-3 py-1 backdrop-blur-md">
                Clear over‑budget alerts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
