import Image from 'next/image'
import React, { useState } from 'react'

const AnncTypeButton = ({src, srcOnHover, text, isActive, onClick}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        className={`h-[143px] flex justify-center items-center gap-[8px] border border-solid rounded-[14px] transition-colors duration-200 cursor-pointer
        ${isActive ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-black hover:border-[#26B5A0] hover:bg-primary hover:text-white'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <Image
            src={(isHovered || isActive) && srcOnHover ? srcOnHover : src}
            alt="house-icon"
            width={40}
            height={40}
        />
        <span className='text-[20px]'>{text}</span>
      </div>
    </>
  )
}

export default AnncTypeButton
