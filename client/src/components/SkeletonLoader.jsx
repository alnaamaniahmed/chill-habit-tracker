import React from "react";

export const HabitCardSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-5 bg-stone-200 rounded-xl w-3/4 mb-3"></div>

        <div className="flex items-center gap-6">
          <div className="h-3 bg-stone-200 rounded-lg w-20"></div>
          <div className="h-3 bg-stone-200 rounded-lg w-16"></div>
        </div>
      </div>

      <div className="w-12 h-12 bg-stone-200 rounded-2xl"></div>
    </div>

    <div className="mt-4 flex gap-1.5">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="w-2 h-2 bg-stone-200 rounded-full"></div>
      ))}
    </div>
  </div>
);

export const StatsCardSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 bg-stone-200 rounded-2xl"></div>
      <div className="flex-1">
        <div className="h-3 bg-stone-200 rounded w-16 mb-2"></div>
        <div className="h-6 bg-stone-200 rounded w-12"></div>
      </div>
    </div>
  </div>
);

export const ProgressChartSkeleton = () => (
  <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 animate-pulse">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-5 h-5 bg-stone-200 rounded"></div>
      <div className="h-5 bg-stone-200 rounded w-32"></div>
    </div>

    <div className="h-48 bg-stone-100 rounded-2xl flex items-end justify-between px-8 pb-4">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="bg-stone-200 rounded-t"
          style={{
            width: "20px",
            height: `${Math.random() * 100 + 50}px`,
          }}
        ></div>
      ))}
    </div>
  </div>
);

export const AddHabitSkeleton = () => (
  <div className="bg-white border border-dashed border-stone-300 rounded-3xl p-6 animate-pulse">
    <div className="flex items-center justify-center gap-3">
      <div className="w-5 h-5 bg-stone-200 rounded"></div>
      <div className="h-4 bg-stone-200 rounded w-32"></div>
    </div>
  </div>
);
