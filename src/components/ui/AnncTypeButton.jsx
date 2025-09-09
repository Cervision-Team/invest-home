import Image from 'next/image'
import React, { useState } from 'react'

const AnncTypeButton = ({src, srcOnHover, text, isActive, onClick}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        className={`w-[303px] h-[64px] flex justify-center items-center gap-[8px] border border-solid rounded-[8px] transition-colors duration-200 cursor-pointer
        ${isActive ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-black hover:border-[#26B5A0] hover:bg-primary hover:text-white'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <Image
            src={(isHovered || isActive) && srcOnHover ? srcOnHover : src}
            alt="house-icon"
            width={24}
            height={24}
        />
        <span className='text-[14px]'>{text}</span>
      </div>
    </>
  )
}

export default AnncTypeButton
