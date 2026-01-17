'use client'
import React, { Suspense, useRef, useState } from 'react';
import { blogData } from '@/components/core/BlogsData';
import Image from 'next/image';
import BlogCard from '@/components/ui/BlogCard';
import PaginationControls from '@/components/ui/PaginationControls';
import Link from 'next/link';


// async function fetchBlogs() {
//   const res = await fetch('https://your-backend.com/api/blogs', { cache: 'no-store' });
//   if (!res.ok) throw new Error('Failed to fetch blogs');
//   return res.json(); 
// }

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const blogsRef = useRef(null);

  const totalPages = Math.ceil(blogData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = blogData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>

      <div className='max-w-[1600px] mx-auto w-auto h-auto flex flex-row justify-between items-center px-[80px] mt-[64px] relative max-[1025px]:px-[20px] max-[431px]:px-[16px] max-[1300px]:justify-center'>
        {blogData.slice(0, 1).map((data, index) => (
          <Link href={`/blogs/${data.id}`}>
            <div key={data.id} className='flex flex-col items-start justify-center'>
              <div className='w-[737px] h-[398px] relative max-[768px]:w-full max-[768px]:h-[300px]'>
                <Image
                  src={data.image}
                  alt={data.title}
                  fill
                  className='rounded-[8px] object-cover'
                />
              </div>
              <p className='text-[#161A20] text-center text-[32px] font-medium mt-[10px]'>"{data.title}"</p>
              <p className='text-[#828080] text-[16px]/[20px] font-normal ml-3 text-center mt-1'>{data.description}</p>
            </div>
          </Link>
        ))}

        <div className='flex flex-row items-center justify-center gap-[18px] max-[1300px]:hidden'>
          <div className='bg-[rgba(0,0,0,0.20)] w-[1px] h-[473px]'></div>

          <div className='flex flex-col justify-between gap-[34px]'>
            <p className='text-[#161A20] text-[24px]/[39px] font-semibold'>Seçilmiş məqalələr</p>
            <Suspense fallback={
              <div className="flex flex-col gap-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex flex-col items-start gap-1">
                    <div className="w-[80%] h-[26px] shimmer rounded" />
                    <div className="w-[40%] h-[20px] shimmer rounded" />
                  </div>
                ))}
              </div>
            }>
              {blogData.slice(1, 6).map((data, index) => (
                <Link href={`/blogs/${data.id}`}>
                  <div key={data.id} className="flex flex-col items-start gap-1">
                    <p className="text-[#161A20] text-[16px]/[26px] font-medium">{data.title}</p>
                    <p className="text-[rgba(0,0,0,0.47)] text-[12px]/[20px] font-normal">{data.date}</p>
                  </div>
                </Link>
              ))}
            </Suspense>
          </div>
        </div>
      </div>

      <div
        ref={blogsRef}
        className='max-w-[1600px] mx-auto w-auto h-auto flex flex-col justify-between items-center px-[80px] mt-[92px] max-lg:px-[16px]'
      >
        <div className='w-full h-auto flex flex-row justify-between items-center text-[#121212] text-[20px]/[20px] font-semibold tracking-[0.2px] max-[431px]:flex-col max-[431px]:items-start max-[431px]:gap-[10px]'>
          <p>Ən çox baxılanlar</p>
          <select className='focus:outline-none custom-select'>
            <option value="latest">Ən son</option>
            <option value="popular">Ən populyar</option>
            <option value="oldest">Ən köhnə</option>
          </select>
        </div>

        <div
          className='w-full h-auto mt-[20px] mb-[64px] grid grid-cols-3 max-[1000px]:grid-cols-2 max-[500px]:grid-cols-1 gap-x-[19px] gap-y-[68px] max-lg:mb-[38px]'
        >
          {currentItems.map((data) => (
            <BlogCard
              key={data.id}
              id={data.id}
              image={data.image}
              title={data.title}
              description={data.description}
              day={data.day}
              month={data.month}
              titleColor="black"
            />
          ))}
        </div>

        <PaginationControls
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          scrollTargetRef={blogsRef}
          scrollOffset={100}
          showSummary={false}
        />
      </div>
    </>
  );
};

export default Page;
