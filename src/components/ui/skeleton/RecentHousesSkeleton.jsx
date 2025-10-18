"use client";

import React from "react";

const RecentHousesSkeleton = () => {
  // Create an array of 5 placeholders to simulate cards
  const skeletons = Array.from({ length: 5 });

  return (
    <section className="max-[431px]:mt-[10px] mt-[60px] max-w-[1600px] mx-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] max-[431px]:pr-0">
      {/* House type selector placeholder */}
      <div className="flex gap-3 mb-6">
        <div className="w-[120px] h-[38px] bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-[120px] h-[38px] bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-[120px] h-[38px] bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      {/* Skeleton cards (carousel style layout) */}
      <div className="flex gap-6 overflow-hidden">
        {skeletons.map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[260px] max-[1024px]:w-[220px] max-[600px]:w-[180px]"
          >
            <div className="w-full h-[180px] bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="mt-3 w-3/4 h-[18px] bg-gray-200 rounded animate-pulse"></div>
            <div className="mt-2 w-1/2 h-[14px] bg-gray-200 rounded animate-pulse"></div>
            <div className="mt-2 w-1/3 h-[14px] bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* “Hamısına bax” button skeleton */}
      <div className="max-[431px]:hidden flex justify-center items-center my-[3rem]">
        <div className="w-[10rem] h-[3rem] bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </section>
  );
};

export default RecentHousesSkeleton;
