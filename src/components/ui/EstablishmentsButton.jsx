"use client"

import Image from 'next/image'
import React, { useState } from 'react'

const EstablishmentsButton = ({ name, icon, iconHover, width, height, active = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)
  const isActive = active || isHovered

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-[73px] h-14 p-2.5 flex flex-col justify-center items-center gap-1 rounded-sm border border-solid border-primary text-[12px]/[16px] font-normal transition-colors duration-200 ${isActive ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-primary'}`}
    >
      <Image
        src={isActive ? iconHover : icon}
        alt={name}
        width={width}
        height={height}
        className="transition duration-200 w-6 h-6 object-contain"
      />
      <span className={`transition duration-200 ${isActive ? 'text-white' : 'text-primary'}`}>
        {name}
      </span>
    </button>
  )
}

export default EstablishmentsButton
