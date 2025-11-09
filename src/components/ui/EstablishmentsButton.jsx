"use client"

import Image from 'next/image'
import React, { useState } from 'react'

const EstablishmentsButton = ({ name, icon, iconHover, width, height }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-[73px] h-[56px] p-[10px] flex flex-col justify-center items-center gap-[4px] rounded-[4px] border border-solid border-primary bg-white text-primary text-[12px]/[16px] font-normal hover:bg-primary transition-colors duration-200"
    >
      <Image
        src={isHovered ? iconHover : icon}
        alt={name}
        width={width}
        height={height}
        className="transition duration-200 w-[24px] h-[24px] object-contain"
      />
      <span className={`transition duration-200 ${isHovered ? 'text-white' : 'text-primary'}`}>
        {name}
      </span>
    </button>
  )
}

export default EstablishmentsButton
