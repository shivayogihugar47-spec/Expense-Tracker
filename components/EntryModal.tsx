import React, { useState, useEffect } from 'react';
import { Category, Transaction } from '../types';
import { X, Upload, Receipt, Trash2, AlertCircle } from 'lucide-react';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'> | Transaction) => void;
  onDelete?: (id: string) => void;
  initialData?: Transaction | null;
}

const EntryModal: React.FC<EntryModalProps> = ({ isOpen, onClose, onSave, onDelete, initialData }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category>(Category.MATERIAL);
  const [type, setType] = useState<'expense' | 'bill'>('expense');
  const [vendor, setVendor] = useState('');
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowDeleteConfirm(false); // Reset delete confirmation state
      if (initialData) {
        setDescription(initialData.description);
        setAmount(initialData.amount.toString());
        setDate(initialData.date);
        setCategory(initialData.category);
        setType(initialData.type);
        setVendor(initialData.vendor || '');
        setFileName(initialData.attachmentName);
      } else {
        // Reset
        setDescription('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setCategory(Category.MATERIAL);
        setType('expense');
        setVendor('');
        setFileName(undefined);
      }
    }
  }, [isOpen, initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) { // 500kb limit
        alert("File too large. Please upload an image smaller than 500KB.");
        return;
      }
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    const transactionData = {
      ...(initialData ? { id: initialData.id } : {}),
      date,
      description,
      amount: parseFloat(amount),
      category,
      type,
      vendor: type === 'bill' ? vendor : undefined,
      attachmentName: fileName,
    };

    onSave(transactionData as Transaction);
    onClose();
  };

  const handleDelete = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    if (initialData && onDelete) {
      onDelete(initialData.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit Entry' : 'Add New Entry'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type Toggle */}
          <div className="flex p-1.5 bg-slate-100/80 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                type === 'expense' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('bill')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                type === 'bill' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Bill
            </button>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount (₹)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <input
              type="text"
              required
              placeholder={type === 'bill' ? "e.g. Invoice #1024 - Marble Tiles" : "e.g. Bought cabinet handles"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400"
            />
          </div>

          {type === 'bill' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Vendor / Store</label>
              <input
                type="text"
                required
                placeholder="e.g. Home Depot, Local Hardware"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 appearance-none cursor-pointer"
              >
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>

          {type === 'bill' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Attachment</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 hover:border-blue-400 transition-all relative cursor-pointer group">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center space-y-2 group-hover:scale-105 transition-transform">
                  {fileName ? (
                    <>
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                         <Receipt className="w-6 h-6" />
                      </div>
                      <span className="text-sm text-slate-800 font-medium truncate max-w-[200px]">{fileName}</span>
                      <span className="text-xs text-blue-500 font-medium">Click to change</span>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-blue-50 text-blue-500 rounded-full">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-sm text-slate-600 font-medium">Upload Bill / Receipt</span>
                      <span className="text-xs text-slate-400">PDF or Image (Max 500KB)</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            {initialData && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                onMouseLeave={() => setShowDeleteConfirm(false)}
                className={`flex-none px-6 py-3.5 font-semibold rounded-xl transition-all flex items-center justify-center ${
                  showDeleteConfirm 
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-md ring-2 ring-red-200' 
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
                title="Delete Entry"
              >
                {showDeleteConfirm ? (
                  <span className="text-sm">Confirm?</span>
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] text-base"
            >
              {initialData ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryModal;