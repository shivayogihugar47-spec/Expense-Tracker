import React, { useState } from 'react';
import { Transaction } from '../types';
import { getBudgetAdvice } from '../services/geminiService';
import { Sparkles, Loader2, MessageSquareQuote } from 'lucide-react';

interface BudgetAdvisorProps {
  transactions: Transaction[];
}

const BudgetAdvisor: React.FC<BudgetAdvisorProps> = ({ transactions }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    const result = await getBudgetAdvice(transactions);
    setAdvice(result);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-40 group"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ask AI Advisor
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-sm z-40 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-white">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-sm">Renovation AI Advisor</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-white/80 hover:text-white transition-colors text-xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[400px] overflow-y-auto">
          {!advice ? (
            <div className="text-center space-y-4 py-4">
              <p className="text-slate-600 text-sm">
                Get smart insights about your renovation budget, potential risks, and saving tips based on your current spending.
              </p>
              <button
                onClick={handleGetAdvice}
                disabled={loading}
                className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Spending...
                  </>
                ) : (
                  'Analyze My Budget'
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 shrink-0">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
                <div className="text-sm text-slate-700 prose prose-sm leading-relaxed whitespace-pre-line">
                  {advice}
                </div>
              </div>
              <button
                onClick={handleGetAdvice}
                disabled={loading}
                className="w-full py-2 text-indigo-600 text-xs font-medium hover:bg-indigo-50 rounded transition-colors"
              >
                {loading ? 'Refreshing...' : 'Refresh Advice'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetAdvisor;