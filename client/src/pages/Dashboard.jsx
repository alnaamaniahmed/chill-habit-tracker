import React, { useState } from "react";
import { Plus, Calendar, Target, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HabitCard from "../components/HabitCard";
import ProgressChart from "../components/ProgressChart.jsx";
import {
  HabitCardSkeleton,
  StatsCardSkeleton,
  ProgressChartSkeleton,
  AddHabitSkeleton,
} from "../components/SkeletonLoader";
import { useHabitsData } from "../hooks/useHabitsData";
import RouteTransition from "../components/RouteTransition";

const StatsCard = ({ icon: Icon, title, value, loading = false }) => {
  if (loading) return <StatsCardSkeleton />;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-stone-100 rounded-2xl">
          <Icon className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-sm text-stone-600 font-medium">{title}</p>
          <p className="text-2xl font-semibold text-stone-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [newTitle, setNewTitle] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingHabit, setAddingHabit] = useState(false);
  const navigate = useNavigate();

  const {
    habits,
    loading,
    error,
    addHabit,
    toggleHabit,
    updateHabit,
    deleteHabit,
  } = useHabitsData();

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setAddingHabit(true);
      await addHabit(newTitle);
      setNewTitle("");
      setShowAddForm(false);
    } catch (err) {
    } finally {
      setAddingHabit(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login", { replace: true });
  };

  const today = new Date().toISOString().slice(0, 10);
  const todayCompleted = habits.filter((h) =>
    h.records.some((r) => r.date === today && r.done)
  ).length;

  const totalHabits = habits.length;
  const completionRate =
    totalHabits > 0 ? Math.round((todayCompleted / totalHabits) * 100) : 0;

  return (
    <RouteTransition type="slideUp">
      <div className="min-h-screen bg-stone-50">
        <div className="bg-white/80 backdrop-blur-xl border-b border-stone-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-dune text-stone-900">HABITS</h1>
                <p className="text-stone-600 text-sm mt-0.5">
                  Track your daily progress
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-stone-500 hover:text-stone-700 transition-colors font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              icon={Calendar}
              title="Today"
              value={loading ? "..." : `${todayCompleted}/${totalHabits}`}
              loading={loading}
            />
            <StatsCard
              icon={Target}
              title="Completion Rate"
              value={loading ? "..." : `${completionRate}%`}
              loading={loading}
            />
            <StatsCard
              icon={Award}
              title="Active Habits"
              value={loading ? "..." : totalHabits}
              loading={loading}
            />
          </div>

          {loading ? (
            <div className="mb-8">
              <ProgressChartSkeleton />
            </div>
          ) : habits.length > 0 ? (
            <div className="mb-8">
              <ProgressChart habits={habits} />
            </div>
          ) : null}

          <div className="mb-8">
            {loading ? (
              <AddHabitSkeleton />
            ) : !showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full bg-white border border-dashed border-stone-300 hover:border-stone-400 hover:bg-stone-50 rounded-3xl p-6 transition-all duration-200 group"
              >
                <div className="flex items-center justify-center gap-3">
                  <Plus className="w-5 h-5 text-stone-500 group-hover:text-stone-700" />
                  <span className="text-stone-600 group-hover:text-stone-800 font-medium">
                    Add new habit
                  </span>
                </div>
              </button>
            ) : (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200">
                <form onSubmit={handleAddHabit} className="flex gap-3">
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="What habit would you like to build?"
                    className="flex-1 p-4 border border-stone-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent bg-white text-stone-900 placeholder-stone-500"
                    disabled={addingHabit}
                  />
                  <button
                    type="submit"
                    disabled={addingHabit}
                    className="px-6 py-4 bg-amber-600 text-white rounded-2xl hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingHabit ? "Adding..." : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTitle("");
                    }}
                    disabled={addingHabit}
                    className="px-4 py-4 text-stone-600 hover:text-stone-800 transition-colors font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {loading ? (
              [...Array(3)].map((_, i) => <HabitCardSkeleton key={i} />)
            ) : habits.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-8 h-8 text-stone-500" />
                </div>
                <h3 className="text-lg font-medium text-stone-800 mb-2">
                  No habits yet
                </h3>
                <p className="text-stone-600">
                  Start building better daily routines
                </p>
              </div>
            ) : (
              habits.map((habit, index) => (
                <div
                  key={habit._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <HabitCard
                    habit={habit}
                    onToggle={toggleHabit}
                    onUpdate={updateHabit}
                    onDelete={deleteHabit}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </RouteTransition>
  );
}
