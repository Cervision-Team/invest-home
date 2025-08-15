'use client'
import React, { Suspense, useRef, useState } from 'react';
import { blogData } from '@/components/core/BlogsData';
import Image from 'next/image';
import BlogCard from '@/components/ui/BlogCard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/FromShadcn/Pagination";
import Link from 'next/link';

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
 if (blogsRef.current) {
      const offset = 100;
      const elementTop = blogsRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      });
    }
    }
  };

  const getVisiblePages = (currentPage, totalPages) => {
    const visibleCount = 4;
    let startPage = 1;

    if (totalPages <= visibleCount) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4];
    }

    startPage = currentPage - 1;

    if (startPage + visibleCount - 1 > totalPages) {
      startPage = totalPages - visibleCount + 1;
    }

    return Array.from({ length: visibleCount }, (_, i) => startPage + i);
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
            <p className='text-[#828080] text-[16px]/[20px] font-normal ml-3 text-center'>{data.description}</p>
          </div>
          </Link>
        //           <div className="flex flex-col items-start justify-center">
        //   <div className="w-[737px] h-[398px] relative shimmer rounded-[8px]" />
        
        //   <div className="mt-[10px] w-[60%] h-[32px] shimmer rounded mx-auto" />
        
        //   <div className="ml-3 mt-2 w-[90%] h-[20px] shimmer rounded" />
        //   <div className="ml-3 mt-2 w-[85%] h-[20px] shimmer rounded" />
        // </div>
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

          {/* <div className="flex flex-col justify-between gap-[34px]">
             <p className="text-[#161A20] text-[24px]/[39px] font-semibold">Seçilmiş məqalələr</p>
           
             {[...Array(5)].map((_, index) => (
               <div key={index} className="flex flex-col items-start justify-start gap-1">
                 <div className="w-[80%] h-[26px] shimmer rounded" />
                 <div className="w-[40%] h-[20px] shimmer rounded" />
               </div>
             ))}
           </div> */}

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
          className='w-full h-auto flex flex-row justify-between items-start mt-[20px] flex-wrap gap-y-[70px] mb-[64px] max-lg:gap-y-[30px] max-lg:mb-[38px]'
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

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>
        
            {getVisiblePages(currentPage, totalPages).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
        
            {totalPages > Math.max(...getVisiblePages(currentPage, totalPages)) && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
        
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
          </>
  );
};

export default Page;
