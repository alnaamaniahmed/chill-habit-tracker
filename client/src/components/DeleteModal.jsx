import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteModal = ({ isOpen, onConfirm, onCancel, habitTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-stone-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-100 rounded-2xl">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-stone-900">Delete Habit</h3>
            <p className="text-stone-600 text-sm">This action cannot be undone</p>
          </div>
        </div>
        
        <p className="text-stone-700 mb-8">
          Are you sure you want to delete <span className="font-medium">"{habitTitle}"</span>? 
          All progress data will be permanently removed.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-stone-300 text-stone-700 rounded-2xl hover:bg-stone-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;