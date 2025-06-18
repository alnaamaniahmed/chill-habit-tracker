import React, { useState } from 'react';
import { CheckCircle2, Circle, MoreHorizontal, Edit3, Trash2, X, Check } from 'lucide-react';
import DeleteModal from './DeleteModal';
const HabitCard = ({habit, onToggle, onUpdate, onDelete}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(habit.title);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const todayRecord = habit.records.find(r => r.date === today);
  const isDone = todayRecord?.done || false;
  
  const sortedRecords = habit.records.sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 0;
  for (let record of sortedRecords) {
    if (record.done) streak++;
    else break;
  }

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== habit.title) {
      onUpdate(habit._id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(habit.title);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowMenu(false);
  };
  const handleConfirmDelete = () => {
    onDelete(habit._id);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 hover:shadow-lg hover:border-stone-300 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2 mb-3">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 text-lg font-medium text-stone-900 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <h3 className="text-lg font-medium text-stone-900 mb-3">
                {habit.title}
              </h3>
            )}
            
            <div className="flex items-center gap-6 text-sm text-stone-600">
              <span className="font-medium">{streak} day streak</span>
              <span className="font-medium">{habit.records.filter(r => r.done).length}/7 this week</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-lg border border-stone-200 py-2 min-w-[120px] z-10">
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={() => onToggle(habit._id)} 
              className={`p-3 rounded-2xl transition-all duration-200 ${
                isDone 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex gap-1.5">
          {habit.records.slice(-7).map((record, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                record.done ? 'bg-amber-600' : 'bg-stone-300'
              }`}
            />
          ))}
        </div>
        
        {/* Click outside to close menu */}
        {showMenu && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setShowMenu(false)}
          />
        )}
      </div>
      <DeleteModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        habitTitle={habit.title}
      />
    </>
  )
}

export default HabitCard