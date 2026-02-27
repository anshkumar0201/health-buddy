// src/components/skeletons/SkeletonGlobal.jsx
import React from "react";

export default function SkeletonGlobal() {
  return (
    // THEME FIX: Forces dark background in dark mode immediately
    <div className="w-full min-h-screen px-4 py-8 bg-white dark:bg-[#131314] transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8 mt-4">
        {/* Fake Header */}
        <div className="flex flex-col items-center space-y-3">
          <div className="h-10 w-48 rounded-xl skeleton-shimmer" />
          <div className="h-4 w-96 max-w-full rounded-lg skeleton-shimmer" />
        </div>

        {/* Fake Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 space-y-4"
            >
              <div className="h-6 w-1/3 rounded skeleton-shimmer" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded skeleton-shimmer" />
                <div className="h-4 w-5/6 rounded skeleton-shimmer" />
              </div>
              <div className="h-32 w-full rounded-xl skeleton-shimmer mt-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
