import Image from 'next/image'
import React from 'react'

const ServicesButton = ({name}) => {
  return (
    <>
      <button className='w-[600px] max-h-24 h-auto pl-10 py-7 flex flex-row items-center gap-[28px] rounded-[20px]
       border border-solid border-[#26B5A0] shadow-[0_1px_0_0_#006C73]'>
         <div className='w-[52px] h-[52px] flex justify-center items-center rounded-[30px] bg-white'>
            <Image
                src="/icons/contract.svg"
                alt="document icon"
                width={34}
                height={34}
            />
         </div>
            <span className='font-medium text-[18px] text-[#1B1F27]'>{name}</span>
      </button>
    </>
  )
}

export default ServicesButton
