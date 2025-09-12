'use client';

import React from 'react';

export default function AgentCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-[20px] h-full animate-pulse">
      <div className="w-[200px] h-[200px] rounded-full bg-gray-300" />

      <div className="flex flex-col gap-[20px] h-full w-[200px]">
        <div className="flex flex-col text-center gap-2">
          <div className="h-[28px] w-full bg-gray-300 rounded"></div>
          <div className="h-[24px] w-3/4 mx-auto bg-gray-300 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-[16px] w-full bg-gray-300 rounded"></div>
          <div className="h-[16px] w-5/6 bg-gray-300 rounded"></div>
          <div className="h-[16px] w-2/3 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
