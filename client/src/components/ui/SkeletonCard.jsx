import React from "react";

// Matches hostel card dimensions (image + 4 lines + button)
export const SkeletonHostelCard = () => (
  <div data-testid="skeleton-hostel-card" className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-slate-800 animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-slate-700" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
      <div className="flex gap-2 pt-1">
        <div className="h-5 w-16 bg-gray-200 dark:bg-slate-700 rounded-full" />
        <div className="h-5 w-16 bg-gray-200 dark:bg-slate-700 rounded-full" />
      </div>
      <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded-lg mt-2" />
    </div>
  </div>
);

// Matches StatCard dims (icon circle + title + value)
export const SkeletonStatCard = () => (
  <div className="rounded-xl p-5 bg-white dark:bg-slate-800 shadow-md animate-pulse">
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-slate-700 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
      </div>
    </div>
  </div>
);

// Matches a notification / list row
export const SkeletonListItem = () => (
  <div className="flex items-start gap-3 p-4 animate-pulse">
    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700 shrink-0" />
    <div className="flex-1 space-y-2 pt-1">
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
    </div>
    <div className="h-3 w-12 bg-gray-200 dark:bg-slate-700 rounded" />
  </div>
);
