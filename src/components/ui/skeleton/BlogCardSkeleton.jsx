import React from 'react';

export const BlogCardSkeleton = () => {
  return (
    <div className="max-w-[414px] w-full flex flex-col relative animate-pulse">
      <div className="h-[240px] rounded-[30px] bg-gray-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20 rounded-[30px]"></div>
      </div>

      <div className="h-[50px] w-[50px] rounded-[0px_0px_10px_10px] bg-gray-200 absolute left-[50px] flex flex-col justify-center items-center shadow-[4px_4px_15px_0px_rgba(0,0,0,0.25)]">
        <div className="h-5 w-6 bg-gray-400 rounded mb-1"></div>
        <div className="h-4 w-8 bg-gray-400 rounded"></div>
      </div>

      <div className="flex items-center mt-[24px] gap-2">
        <div className="h-[28px] w-[200px] bg-gray-400 rounded"></div>
        <div className="h-[50px] w-[50px] bg-gray-300 rounded-full"></div>
      </div>

      <div className="mt-[10px] flex flex-col gap-2">
        <div className="h-4 w-full bg-gray-300 rounded"></div>
        <div className="h-4 w-[90%] bg-gray-300 rounded"></div>
        <div className="h-4 w-[80%] bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
