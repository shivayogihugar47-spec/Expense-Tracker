import React, { useState, useEffect } from 'react'; 
import { Category, Transaction } from '../types';
import { X, Upload, Receipt, Trash2 } from 'lucide-react';

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
      setShowDeleteConfirm(false);
      if (initialData) {
        setDescription(initialData.description);
        setAmount(initialData.amount.toString());
        setDate(initialData.date);
        setCategory(initialData.category);
        setType(initialData.type);
        setVendor(initialData.vendor || '');
        setFileName(initialData.attachmentName);
      } else {
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
      if (file.size > 500000) {
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
      {/* SMALLER MODAL */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {initialData ? 'Edit Entry' : 'Add New Entry'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">

          {/* TYPE TOGGLE */}
          <div className="flex p-1 bg-slate-100/80 rounded-xl mb-2">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                type === 'expense' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('bill')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                type === 'bill' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'
              }`}
            >
              Bill
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input
              type="text"
              required
              placeholder={type === 'bill' ? "Invoice #1024 - Marble Tiles" : "Bought cabinet handles"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
            />
          </div>

          {type === 'bill' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vendor / Store</label>
              <input
                type="text"
                required
                placeholder="Home Depot, Local Hardware"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
            >
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {type === 'bill' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Attachment</label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center space-y-1">
                  {fileName ? (
                    <>
                      <Receipt className="w-6 h-6 text-emerald-600" />
                      <span className="text-sm font-medium truncate max-w-[180px]">{fileName}</span>
                      <span className="text-xs text-blue-500">Click to change</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-blue-500" />
                      <span className="text-sm text-slate-600">Upload Bill / Receipt</span>
                      <span className="text-xs text-slate-400">Max 500KB</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex gap-2">
            {initialData && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className={`px-5 py-3 rounded-lg font-semibold ${
                  showDeleteConfirm
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {showDeleteConfirm ? 'Confirm?' : <Trash2 className="w-5 h-5" />}
              </button>
            )}

            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg"
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
