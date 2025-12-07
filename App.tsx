import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, BudgetStats } from './types';
import { TOTAL_BUDGET, INITIAL_TRANSACTIONS } from './constants';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import EntryModal from './components/EntryModal';
import { Plus, LayoutDashboard, List } from 'lucide-react';

// Simple hook to persist state
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

const App: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('kitchen_renovate_transactions', INITIAL_TRANSACTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions'>('dashboard');

  const stats: BudgetStats = React.useMemo(() => {
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      totalBudget: TOTAL_BUDGET,
      totalSpent,
      remaining: TOTAL_BUDGET - totalSpent,
    };
  }, [transactions]);

  const handleAddTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: uuidv4() };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const handleEditTransaction = (t: Transaction) => {
    setTransactions((prev) => prev.map((item) => (item.id === t.id ? t : item)));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    // Confirmation is now handled in the UI (TransactionList & EntryModal) to avoid browser blocking
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    closeModal();
  };

  const openEditModal = (t: Transaction) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 leading-tight">KitchenRenovate</h1>
                <p className="text-xs text-slate-500 font-medium">Project Tracker</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
               {/* Mobile/Desktop Tab Switcher */}
               <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <LayoutDashboard className="w-4 h-4 inline-block sm:mr-1" />
                    <span className="hidden sm:inline">Overview</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'transactions' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <List className="w-4 h-4 inline-block sm:mr-1" />
                    <span className="hidden sm:inline">Transactions</span>
                  </button>
               </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard stats={stats} transactions={transactions} />
        )}
        
        {activeTab === 'transactions' && (
          <TransactionList 
            transactions={transactions} 
            onEdit={openEditModal} 
            onDelete={handleDeleteTransaction} 
          />
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setEditingTransaction(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-24 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-blue-500/30 transition-all z-40 active:scale-90 flex items-center gap-2 group"
      >
        <Plus className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-semibold">
          Add Entry
        </span>
      </button>

   

      {/* Modal */}
      <EntryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={(t) => {
          if ('id' in t) {
            handleEditTransaction(t as Transaction);
          } else {
            handleAddTransaction(t);
          }
        }}
        onDelete={handleDeleteTransaction}
        initialData={editingTransaction}
      />
    </div>
  );
};

export default App;
