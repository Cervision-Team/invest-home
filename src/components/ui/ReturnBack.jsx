"use client"

import Image from 'next/image'
import ArrowLeft from "../../../public/icons/mobile-category/arrow-left.svg"

const ReturnBack = () => {
  return (
    <>
    <div className='flex flex-row items-center justify-center  '>
      <Image
        src={ArrowLeft}
        className='cursor-pointer'
        onClick={() => window.history.back()}
        alt="arrow-left"
        width={24}
        height={24}
        />
      <p className='text-[#1B1F27] text-center text-[16px] font-semibold'>Geri</p>
    </div>
 
    </>
  )
}

export default ReturnBack
